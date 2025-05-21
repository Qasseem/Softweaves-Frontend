import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehousesService } from '../../services/warehouses.service';
import { take } from 'rxjs';
import { UserService } from 'src/app/modules/user-management/services/user.service';

@Component({
  selector: 'app-warehouses-form',
  templateUrl: './warehouses-form.component.html',
  styleUrls: ['./warehouses-form.component.scss'],
})
export class WarehousesFormComponent implements OnInit {
  form: FormGroup;
  details: any;
  id;
  formType = 'add';
  usersList = [];
  constructor(
    private fb: FormBuilder,
    private service: WarehousesService,
    private router: Router,
    private userSerivice: UserService,
    private route: ActivatedRoute
  ) {
    this.formType = this.route.snapshot.data.type;
    this.getUsers();
  }
  getUsers() {
    this.userSerivice
      .getAllSystemUserDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.usersList = resp.data;
        }
      });
  }

  ngOnInit() {
    if (this.formType == 'edit') {
      this.id = this.route.snapshot.params.id || null;
      if (this.id) {
        this.getItemDetails();
      }
    }
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      managerIds: [[], [Validators.required]],
      id: [null],
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
            this.form.controls['name'].setValue(this.details.warehouseName);
            this.form.updateValueAndValidity();
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
    this.router.navigate(['main/inventory/warehouses/list']);
  }
}
