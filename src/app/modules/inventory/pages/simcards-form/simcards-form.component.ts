import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimcardsService } from '../../services/simcards.service';
import { take } from 'rxjs';
import { WarehousesService } from '../../services/warehouses.service';

@Component({
  selector: 'app-simcards-form',
  templateUrl: './simcards-form.component.html',
  styleUrls: ['./simcards-form.component.scss'],
})
export class SimcardsFormComponent implements OnInit {
  form: FormGroup;
  details: any;
  id;
  formType = 'add';
  statusesList = [];
  warehousesList = [];
  providersList = [];
  typesList = [];
  constructor(
    private fb: FormBuilder,
    private service: SimcardsService,
    private router: Router,
    private route: ActivatedRoute,
    private warehousesService: WarehousesService
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
      providerId: [null, [Validators.required]],
      typeId: [null, [Validators.required]],
      shipmentId: [null],
      warehouseId: [null, [Validators.required]],
      quota: [null, [Validators.required]],
      serialNumber: [null, [Validators.required]],
      imei: [null, [Validators.required]],
      id: [null],
    });
    this.getLookupsDropdowns();
  }
  getLookupsDropdowns() {
    this.getStatusDropDown();
    this.getWarehouseDropDown();
    this.getProviderDropDown();
  }

  getStatusDropDown() {
    this.service
      .getStatusDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.statusesList = resp.data;
        }
      });
  }

  getTypeDropDown(id) {
    this.service
      .getTypeDropDown(id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.typesList = resp.data;
          if (this.formType == 'edit') {
            this.form.get('typeId').setValue(this.details.typeId);
          }
        }
      });
  }

  getWarehouseDropDown() {
    this.warehousesService
      .getAgentWarehouseDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.warehousesList = resp.data;
        }
      });
  }

  getProviderDropDown() {
    this.service
      .getProviderDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.providersList = resp.data;
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
            this.form.get('providerId').setValue(this.details.providerId);
            // this.getTypeDropDown(this.form.get('providerId').value);
            this.form.updateValueAndValidity();
          }
        }
      });
  }

  onChangeProvider(event: any) {
    this.typesList = [];
    this.form.controls.typeId.setValue(null);
    if (event) {
      this.getTypeDropDown(event);
    }
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
    this.router.navigate(['main/inventory/simcards/list']);
  }
}
