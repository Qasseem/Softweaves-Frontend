import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DevicesService } from '../../services/devices.service';
import { forkJoin, take } from 'rxjs';
import { ToastService } from 'src/app/core/services/toaster.service';
import { TicketService } from 'src/app/modules/ticket/services/ticket.service';
import { HttpService } from 'src/app/core/http/http.service';
import { UserService } from 'src/app/modules/user-management/services/user.service';
import { WarehousesService } from '../../services/warehouses.service';

@Component({
  selector: 'app-device-cancel',
  templateUrl: './device-cancel.component.html',
  styleUrls: ['./device-cancel.component.css'],
})
export class DeviceCancelComponent implements OnInit {
  form: FormGroup;
  details: any;
  id;
  modelCategories = [];
  modelTypes = [];
  errandChanelsList = [];
  warehousesList = [];
  deviceConditionList = [];
  fileName: any;
  files = [];
  subscriptionTypes = [];
  posChargerModels = [];
  simCardModels = [];
  cableModels = [];
  receiptModels = [];
  paperRollModels = [];
  paymentMethods = [];
  paymentStatuses = [];
  conditions = [];
  users = [];
  currencies = [];
  teams = [];
  warehouses = [];
  countryId: any;
  reciptSignedOptions = [
    { id: true, nameEn: 'Yes' },
    { id: false, nameEn: 'No' },
  ];
  constructor(
    private fb: FormBuilder,
    private service: DevicesService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastService,
    private ticketService: TicketService,
    private httpService: HttpService,
    private userService: UserService,
    private warehouseService: WarehousesService
  ) {
    this.countryId = httpService.country;
  }

  ngOnInit() {
    // this.getItemDetails();
    this.id = this.route.snapshot.params.id || null;

    let ss = {
      deviceId: 0,
      cancellationDate: '2025-08-22T17:09:30.046Z',
      warehouseId: 0,
      merchantName: 'string',
      mId: 'string',
      tid: 'string',
      cancellationFee: 'string',
      currencyId: 0,
      paymentMethodId: 0,
      paymentStatusId: 0,
      trx_ID: 'string',
      clrearanceReceiptSigned: true,
      cancelledById: 0,
      gtg: true,
      needRecycling: true,
      needRepair: true,
      needBranding: true,
      conditionId: 0,
      cancelReceiptModelTypeId: 0,
      notes: 'string',
      attachmentsBase64: ['string'],
    };

    this.form = this.fb.group({
      deviceId: [0, Validators.required],
      cancellationDate: ['', Validators.required],
      warehouseId: [null, Validators.required],
      merchantName: ['', [Validators.required, Validators.maxLength(50)]],
      mId: ['', [Validators.required, Validators.maxLength(50)]],
      tid: ['', [Validators.required, Validators.maxLength(50)]],
      cancellationFee: ['', [Validators.required, Validators.maxLength(10)]],
      currencyId: [0, Validators.required],
      paymentMethodId: [0, Validators.required],
      trx_ID: ['', Validators.required],
      clrearanceReceiptSigned: [null, Validators.required],
      deployedTeamId: [null, Validators.required],
      cancelledById: [null, Validators.required],
      gtg: [null, Validators.required],
      needRecycling: [null, Validators.required],
      needRepair: [null, Validators.required],
      needBranding: [null, Validators.required],
      conditionId: [null, Validators.required],
      cancelReceiptModelTypeId: [null, Validators.required],
      notes: ['', [Validators.maxLength(500)]],
      attachmentsBase64: [[]],
    });
    this.loadAllLookups();
  }

  loadAllLookups() {
    forkJoin({
      currency: this.service.getCurrencyDropDown(),
      paymentMethod: this.service.getPaymentMethodDropDown(),
      team: this.service.getTeamDropDown(),
      condition: this.service.getConditionDropDown(),
      deployReceipt: this.ticketService.GetCancellationReceiptModelTypes(),
      warehouse: this.warehouseService.getAgentWarehouseDropDown(),
      users: this.userService.getAllUsers(),
      // add remaining lookups
    }).subscribe((results) => {
      this.currencies = results.currency.data;
      this.paymentMethods = results.paymentMethod.data;
      this.teams = results.team.data;
      this.receiptModels = results.deployReceipt.data;
      this.conditions = results.condition.data;
      this.warehouses = results.warehouse.data;
      this.users = results.users.data;
    });
  }

  get f() {
    return this.form.controls;
  }
  submit() {
    let obj = this.form.value;
    obj.deviceId = this.id;
    this.addAttachmentsToFormAsBase64(obj);

    this.service
      .Cancel(obj)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.backToList();
          }
        },
      });
  }
  addAttachmentsToFormAsBase64(obj: any) {
    if (this.files.length > 0) {
      obj.attachmentsBase64 = this.files.map((file) => {
        return file.base64 || file.url;
      });
    } else {
      obj.attachmentsBase64 = [];
    }
    this.form.patchValue({
      attachmentsBase64: obj.attachmentsBase64,
    });
    this.form.updateValueAndValidity();
  }

  onFileSelected(event) {
    if (this.files.length >= 5) {
      this.toaster.showError('max 5 files allowed');
    }
    const file = event.target.files[0];
    let base64String = '';
    if (file) {
      this.convertFileToBase64(file).then((base64: string) => {
        base64String = base64;
      });
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        let toSaveFile = {
          name: this.fileName,
          data: reader.result,
          type: file.type,
          base64: base64String,
          isImage: file.type.match('image.*'),
          url: null,
        };
        this.files.push(toSaveFile);
      };
      reader.readAsDataURL(file);
    }
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  removeImage(item) {
    this.files.splice(this.files.indexOf(item), 1);
  }

  backToList() {
    this.router.navigate(['main/inventory/devices/list']);
  }
}
