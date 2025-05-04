import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs';
import { ErrandTypeService } from '../../services/errand-type.service';
import { ModeltypesService } from 'src/app/modules/inventory/services/modeltypes.service';
import { ItemsWithoutSerialService } from 'src/app/modules/inventory/services/items-without-serial.service';
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
  itemscategoriesLists = [];
  modelTypesList = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: ErrandTypeService,
    private modeltypesService: ModeltypesService,
    private itemsWithoutSerialService: ItemsWithoutSerialService
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
      requireQuantity: [null],
      modelCategoryId: [null],
      modelTypeId: [null],
      id: [null],
    });

    this.getCategoriesErrandType();
    this.getCategoryDropDown();
  }
  getCategoryDropDown() {
    this.itemsWithoutSerialService
      .getCategoryDropDown()
      .pipe(takeWhile(() => this.alive))
      .subscribe((resp) => {
        if (resp.success) {
          // this.itemscategoriesLists = resp.data;
          this.categoriesLists = resp.data;
        }
      });
  }

  categoryChanged(event) {
    this.modelTypesList = [];
    this.form.controls.modelTypeId.setValue(null);
    if (event?.value) {
      this.GetModelTypeDropDown(event?.value);
    }
  }
  GetModelTypeDropDown(id) {
    this.itemsWithoutSerialService
      .getModelTypeDropDown(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((resp) => {
        if (resp.success) {
          this.modelTypesList = resp.data;
        }
      });
  }

  getCategoriesErrandType() {
    this.service
      .getCategoriesFixed()
      .pipe(takeWhile(() => this.alive))
      .subscribe((resp) => {
        if (resp.success) {
          this.itemscategoriesLists = resp.data;
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
            this.GetModelTypeDropDown(resp.data?.modelCategoryId);
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
    this.form.controls.modelTypeId.setValue(null);
    this.form.controls.modelCategoryId.setValidators(null);
    //Set controls as required
    if (event?.checked) {
      this.form.controls.modelTypeId.setValidators([Validators.required]);
      this.form.controls.modelCategoryId.setValidators([Validators.required]);
      this.form.updateValueAndValidity();
    } else {
      this.form.controls.modelTypeId.clearValidators();
      this.form.controls.modelCategoryId.clearValidators();
    }
    this.form.controls.modelTypeId.updateValueAndValidity();
    this.form.controls.modelCategoryId.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }
}
