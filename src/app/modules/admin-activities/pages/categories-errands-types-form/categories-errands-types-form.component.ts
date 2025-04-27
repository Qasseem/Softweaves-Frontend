import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs';
import { ErrandTypeService } from '../../services/errand-type.service';
@Component({
  selector: 'oc-categories-errands-types-form',
  templateUrl: './categories-errands-types-form.component.html',
  styleUrls: ['./categories-errands-types-form.component.scss'],
})
export class CategoriesErrandTypesFormComponent implements OnInit, OnDestroy {
  alive: boolean = true;
  form: FormGroup;
  id;
  details: any;
  formType = 'add';
  categoriesLists = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: ErrandTypeService
  ) {
    this.formType = this.route.snapshot.data.type;
  }

  ngOnInit() {
    const arabicLetterPattern = new RegExp(/^[\u0600-\u06FF0-9\s!@#$%^&*()]+$/);
    const englishLetterPattern = new RegExp(/^[a-zA-Z0-9\s!@#$%^&*()]+$/);
    if (this.formType == 'edit') {
      this.id = this.route.snapshot.params.id || null;
      if (this.id) {
        this.getItemDetails();
      }
    }
    this.form = this.fb.group({
      categoryId: ['', Validators.required],
      nameEn: [
        '',
        [Validators.required, Validators.pattern(englishLetterPattern)],
      ],
      nameAr: ['', [Validators.pattern(arabicLetterPattern)]],
      serviceLevel: ['', Validators.required],
      requireQuantity: [null, Validators.required],
      itemCategoryId: [null],
      item: [null],
      id: [null],
    });

    this.getCategoriesErrandType();
  }

  getCategoriesErrandType() {
    this.service
      .getCategoriesFixed()
      .pipe(takeWhile(() => this.alive))
      .subscribe((resp) => {
        if (resp.success) {
          this.categoriesLists = resp.data;
        }
      });
  }
  getItemDetails() {
    this.service
      .GetCategoriesErrandsTypesDetails(this.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((resp) => {
        if (resp.success) {
          this.details = resp.data;
          if (this.details) {
            this.form.patchValue(this.details);
            this.form.updateValueAndValidity();
          }
        }
      });
  }

  onSubmit() {}
  get f() {
    return this.form.controls;
  }
  submit() {
    let obj = this.form.value;
    if (!this.id) {
      delete obj.id;
    }
    this.service
      .AddErrandsType(this.form.value)
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.backToList();
          }
        },
      });
  }
  backToList() {
    this.router.navigate([
      'main/admin-activities/list/categories-errands-types',
    ]);
  }

  ngOnDestroy() {
    this.alive = false;
  }
  requieredQuantityChanged(event) {
    //Set controls as required
    if (event?.checked) {
      this.form.controls.item.setValidators([Validators.required]);
      this.form.controls.itemCategoryId.setValidators([Validators.required]);
      this.form.updateValueAndValidity();
    } else {
      this.form.controls.item.setValidators(null);
      this.form.controls.itemCategoryId.setValidators(null);
      this.form.updateValueAndValidity();
    }
  }
}
