import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DevicesService } from '../../services/devices.service';
import { take } from 'rxjs';
import { ModeltypesService } from '../../services/modeltypes.service';
import { WarehousesService } from '../../services/warehouses.service';
import { ErrandChannelService } from 'src/app/modules/admin-activities/services/errand-channel.service';
import { TerminalService } from 'src/app/modules/terminal/services/terminal.service';
import { ToastService } from 'src/app/core/services/toaster.service';

@Component({
  selector: 'app-devices-form',
  templateUrl: './devices-form.component.html',
  styleUrls: ['./devices-form.component.scss'],
})
export class DevicesFormComponent implements OnInit {
  form: FormGroup;
  details: any;
  id;
  formType = 'add';
  modelCategories = [];
  modelTypes = [];
  errandChanelsList = [];
  warehousesList = [];
  deviceConditionList = [];
  fileName: any;
  files = [];
  banksList = [];
  countriesList = [];
  locationsList = [];
  constructor(
    private fb: FormBuilder,
    private service: DevicesService,
    private router: Router,
    private route: ActivatedRoute,
    private modeltypesService: ModeltypesService,
    private warehousesService: WarehousesService,
    private terminalService: TerminalService,
    private toaster: ToastService
  ) {
    this.formType = this.route.snapshot.data.type;
  }

  ngOnInit() {
    if (this.formType == 'edit') {
      this.id = this.route.snapshot.params.id || null;
      if (this.id) {
        this.getItemDetails();
      }
    }
    this.form = this.fb.group({
      modelCategoryId: ['', [Validators.required]],
      modelTypeId: [null, [Validators.required]],
      conditionId: [null, [Validators.required]],
      errandChannelId: [null],
      shipmentId: [null],
      warehouseId: [null, [Validators.required]],
      serialNumber: [null, [Validators.required]],
      imei: [null, [Validators.required]],
      bankId: [null, [Validators.required]],
      countryId: [null, [Validators.required]],
      assignedLocationId: [null, [Validators.required]],
      notes: [null, [Validators.maxLength(500)]],

      simSerial: [null, []],
      id: [null],
    });
    this.getLookupsDropdowns();
  }
  getLookupsDropdowns() {
    this.getmodelCategories();
    this.getWarehouseDropDown();
    this.getAllErrandChannels();
    this.getDeviceConditionDropDown();
    this.getDeviceConditionDropDown();
  }

  onChangeModelCategory(event) {
    this.form.controls.modelTypeId.setValue(null);
    if (event) {
      this.getModelTypeDropDown(event);
    }
  }

  getmodelCategories() {
    this.modeltypesService
      .getCategoryDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.modelCategories = resp.data;
        }
      });
  }
  getModelTypeDropDown(id: number) {
    this.modeltypesService
      .getModelTypeDropDown(id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.modelTypes = resp.data;
          if (this.formType == 'edit') {
            this.form.get('modelTypeId').setValue(this.details.modelTypeId);
          }
        }
      });
  }

  getWarehouseDropDown() {
    this.warehousesService
      .getWarehouseDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.warehousesList = resp.data;
        }
      });
  }

  getAllErrandChannels() {
    this.terminalService
      .GetAllErrandChannels()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.errandChanelsList = resp.data;
        }
      });
  }

  getDeviceConditionDropDown() {
    this.service
      .getConditionDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.deviceConditionList = resp.data;
        }
      });
  }

  getBanksList() {
    this.service
      .getBanksList()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.banksList = resp.data;
        }
      });
  }

  getCountriesList() {
    this.service
      .getCountriesList()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.countriesList = resp.data;
        }
      });
  }

  getLoactionsList() {
    this.service
      .getLoactionsList()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.locationsList = resp.data;
        }
      });
  }

  getItemDetails() {
    this.service
      .getDetailsById(this.id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.details = resp.data;
          if (this.details) {
            this.form.patchValue(this.details);
            this.form.get('modelCategoryId').setValue(this.details.categoryId);
            this.form.updateValueAndValidity();
            this.getModelTypeDropDown(this.form.get('modelCategoryId').value);
          }
        }
      });
  }
  get f() {
    return this.form.controls;
  }
  submit() {
    let obj = this.form.value;
    if (!this.id) {
      delete obj.id;
    }
    if (this.formType == 'add') {
      this.service
        .add(this.form.value)
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            if (resp.success) {
              this.backToList();
            }
          },
        });
    } else {
      this.service
        .update(this.form.value)
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            if (resp.success) {
              this.backToList();
            }
          },
        });
    }
  }

  onFileSelected(event) {
    if (this.files.length >= 5) {
      this.toaster.showError('max 5 files allowed');
    }
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        let toSaveFile = {
          name: this.fileName,
          data: reader.result,
          type: file.type,
          isImage: file.type.match('image.*'),
        };
        this.files.push(toSaveFile);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(item) {
    this.files.splice(this.files.indexOf(item), 1);
  }

  backToList() {
    this.router.navigate(['main/inventory/devices/list']);
  }
}
