import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModeltypesService } from '../../services/modeltypes.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-model-types-form',
  templateUrl: './model-types-form.component.html',
  styleUrls: ['./model-types-form.component.scss'],
})
export class ModelTypesFormComponent implements OnInit {
  form: FormGroup;
  details: any;
  id;
  formType = 'add';
  categoriesList = [];
  constructor(
    private fb: FormBuilder,
    private service: ModeltypesService,
    private router: Router,
    private route: ActivatedRoute
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
      name: ['', [Validators.required]],
      categoryId: [[], [Validators.required]],
      id: [null],
    });
    this.getCategoryDropDown();
  }

  getCategoryDropDown() {
    this.service
      .getCategoryDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.categoriesList = resp.data;
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
            this.form.controls['name'].setValue(this.details?.modelTypeName);
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
    this.router.navigate(['main/inventory/modeltypes/list']);
  }
}
