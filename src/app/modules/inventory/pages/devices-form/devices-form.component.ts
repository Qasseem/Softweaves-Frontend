import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DevicesService } from '../../services/devices.service';
import { take } from 'rxjs';
import { ModeltypesService } from '../../services/modeltypes.service';
import { WarehousesService } from '../../services/warehouses.service';
import { ErrandChannelService } from 'src/app/modules/admin-activities/services/errand-channel.service';
import { TerminalService } from 'src/app/modules/terminal/services/terminal.service';

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
  constructor(
    private fb: FormBuilder,
    private service: DevicesService,
    private router: Router,
    private route: ActivatedRoute,
    private modeltypesService: ModeltypesService,
    private warehousesService: WarehousesService,
    private terminalService: TerminalService
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
      errandChannelId: [null, [Validators.required]],
      shipmentId: [null],
      warehouseId: [null, [Validators.required]],
      serialNumber: [null, [Validators.required]],
      imei: [null, [Validators.required]],
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
  backToList() {
    this.router.navigate(['main/inventory/devices/list']);
  }
}
