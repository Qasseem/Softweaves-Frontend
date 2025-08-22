import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DevicesService } from '../../services/devices.service';
import { forkJoin, take } from 'rxjs';
import { ToastService } from 'src/app/core/services/toaster.service';
import { TicketService } from 'src/app/modules/ticket/services/ticket.service';
import { HttpService } from 'src/app/core/http/http.service';
import { UserService } from 'src/app/modules/user-management/services/user.service';

@Component({
  selector: 'app-device-deployment',
  templateUrl: './device-deployment.component.html',
  styleUrls: ['./device-deployment.component.css'],
})
export class DeviceDeploymentComponent implements OnInit {
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
    private userService: UserService
  ) {
    this.countryId = httpService.country;
  }

  ngOnInit() {
    // this.getItemDetails();
    this.id = this.route.snapshot.params.id || null;

    this.form = this.fb.group({
      deviceId: [0, Validators.required],
      deploymentDate: ['', Validators.required],
      merchantName: ['', [Validators.required, Validators.maxLength(50)]],
      mId: ['', [Validators.required, Validators.maxLength(50)]],
      tid: ['', [Validators.required, Validators.maxLength(50)]],
      setupAmount: ['', [Validators.required, Validators.maxLength(10)]],
      subscriptionAmount: ['', [Validators.required, Validators.maxLength(10)]],
      subscriptionTypeId: [0, Validators.required],
      currencyId: [0, Validators.required],
      paymentMethodId: [0, Validators.required],
      paymentStatusId: [0, Validators.required],
      trx_ID: ['', Validators.required],
      deploymentReceiptSigned: [null, Validators.required],
      deployedTeamId: [null, Validators.required],
      deployedById: [null, Validators.required],
      conditionId: [null, Validators.required],
      simCardModelTypeId: [null, Validators.required],
      cableModelTypeId: [null, Validators.required],
      receiptModelTypeId: [null, Validators.required],
      paperRollModelTypeId: [null, Validators.required],
      posChargerModelTypeId: [null, Validators.required],
      address: ['', [Validators.maxLength(50)]],
      notes: ['', [Validators.maxLength(500)]],
      merchantPhoneNumber: [
        '',
        [Validators.required, Validators.maxLength(50)],
      ],
      attachmentsBase64: [[]],
    });
    this.loadAllLookups();
  }

  loadAllLookups() {
    forkJoin({
      currency: this.service.getCurrencyDropDown(),
      subscriptionTypes: this.service.getSubscriptionTypeDropDown(),
      paymentMethod: this.service.getPaymentMethodDropDown(),
      paymentStatus: this.service.getPaymentStatusDropDown(),
      team: this.service.getTeamDropDown(),
      condition: this.service.getConditionDropDown(),
      paperRoll: this.ticketService.GetPaperRollModelTypes(),
      deployReceipt: this.ticketService.GetDeployReceiptModelTypes(),
      simcardProvider: this.ticketService.getSIMCardProviders(this.countryId),
      posCharger: this.ticketService.getPOSChargerModelTypes(),
      cables: this.ticketService.GetCableModelTypes(),
      // add remaining lookups
    }).subscribe((results) => {
      this.currencies = results.currency.data;
      this.paymentMethods = results.paymentMethod.data;
      this.paymentStatuses = results.paymentStatus.data;
      this.subscriptionTypes = results.subscriptionTypes.data;
      this.teams = results.team.data;
      this.paperRollModels = results.paperRoll.data;
      this.receiptModels = results.deployReceipt.data;
      this.simCardModels = results.simcardProvider.data;
      this.posChargerModels = results.posCharger.data;
      this.cableModels = results.cables.data;
      this.conditions = results.condition.data;
    });
  }

  getUserByType(event) {
    if (event && event.value) {
      var userType = event.value;
      this.userService
        .getUsersByUserType(userType)
        .pipe(take(1))
        .subscribe((resp) => {
          if (resp.success) {
            this.users = resp.data;
          }
        });
    } else {
      this.users = [];
    }
  }

  get f() {
    return this.form.controls;
  }
  submit() {
    let obj = this.form.value;
    obj.deviceId = this.id;
    this.addAttachmentsToFormAsBase64(obj);
    this.service
      .Deploy(obj)
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
