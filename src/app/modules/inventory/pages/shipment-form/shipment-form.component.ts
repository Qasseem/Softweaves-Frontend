import { Component, OnInit } from '@angular/core';
import { ShipmentsService } from '../../services/shipments.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModeltypesService } from '../../services/modeltypes.service';
import { WarehousesService } from '../../services/warehouses.service';
import { take } from 'rxjs';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { ExportExcelService } from 'src/app/modules/shared/Services/export-excel.service';

@Component({
  selector: 'app-shipment-form',
  templateUrl: './shipment-form.component.html',
  styleUrls: ['./shipment-form.component.css'],
})
export class ShipmentFormComponent implements OnInit {
  form: FormGroup;
  modelsForm: FormGroup;
  details: any;
  id;
  formType = 'add';
  modelCategories = [];
  modelTypes = [];
  errandChanelsList = [];
  warehousesList = [];
  deviceConditionList = [];
  familiesList = [];
  modeltypeList = [];
  modeltypesFormList = [];
  itemsFormControlsList = [
    {
      name: 'familyId',
      header: 'Inventory Family',
      data: this.familiesList,
    },
    {
      name: 'categoryId',
      header: 'Model Category',
      data: this.modelCategories,
    },
    {
      name: 'modelTypeId',
      header: 'Model Type',
      data: this.modeltypeList,
    },
  ];
  selectedModelType: any;
  selectedFamily: any;
  selectedCategory: any;
  constructor(
    private fb: FormBuilder,
    private service: ShipmentsService,
    private router: Router,
    private route: ActivatedRoute,
    private warehousesService: WarehousesService,
    private exportExcelService: ExportExcelService
  ) {
    this.formType = this.route.snapshot.data.type;
  }

  public columns: ColumnsInterface[] = [
    {
      field: 'index',
      header: 'NO.',
      width: '50px',
    },

    {
      field: 'family',
      header: 'Inventory Family',
      width: '200px',
    },
    {
      field: 'category',
      header: 'Category',
      width: '200px',
    },
    {
      field: 'modeltype',
      header: 'Device/Item',
      width: '200px',
    },
    {
      field: 'quantity',
      header: 'QTY',
      width: '200px',
    },
  ];

  ngOnInit() {
    if (this.formType == 'edit') {
      this.id = this.route.snapshot.params.id || null;
      if (this.id) {
        this.getItemDetails();
      }
    }
    this.form = this.fb.group({
      supplier: ['', [Validators.required]],
      shipmentId: [null, [Validators.required]],
      shipmentDate: [null, [Validators.required]],
      warehouseId: [null, [Validators.required]],

      id: [null],
    });

    this.modelsForm = this.fb.group({
      familyId: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      modelTypeId: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      id: [null],
    });
    this.getLookupsDropdowns();
  }
  getLookupsDropdowns() {
    this.getWarehouseDropDown();
    this.getFamilyDropDown();
  }

  async getCategoryDropDownByFamilyId(id) {
    await this.service
      .getCategoryDropDownByFamilyId(id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.modelCategories = resp.data;
          this.itemsFormControlsList[1].data = [...this.modelCategories];
          this.itemsFormControlsList[2].data = [];
        }
      });
  }

  getFamilyDropDown() {
    this.service
      .getFamilyDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.familiesList = resp.data;
          this.itemsFormControlsList[0].data = [...this.familiesList];
          this.itemsFormControlsList[1].data = [];
          this.itemsFormControlsList[2].data = [];
        }
      });
  }
  getModelTypeDropDownByCategoryId(id: number) {
    this.service
      .getModelTypeDropDownByCategoryId(id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.modeltypeList = resp.data;
          this.itemsFormControlsList[2].data = [...this.modeltypeList];
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

  getItemDetails() {
    this.service
      .getDetailsById(this.id)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.details = resp.data;
          if (this.details) {
            this.form.patchValue(this.details);
            // this.form.get('modelCategoryId').setValue(this.details.categoryId);
          }
        }
      });
  }

  onSelectOption(selectedOption: any, controlName: DDLControlType) {
    if (!selectedOption) return;
    switch (controlName) {
      case DDLControlType.Family:
        this.getCategoryDropDownByFamilyId(selectedOption?.value);
        this.selectedFamily = this.familiesList.find(
          (family) => family.id === selectedOption?.value
        );
        break;
      case DDLControlType.Category:
        this.getModelTypeDropDownByCategoryId(selectedOption?.value);
        this.selectedCategory = this.modelCategories.find(
          (category) => category.id === selectedOption?.value
        );
        break;
      case DDLControlType.ModelType:
        this.selectedModelType = this.modeltypeList.find(
          (modelType) => modelType.id === selectedOption?.value
        );
        break;
    }
  }
  get f() {
    return this.form.controls;
  }
  get mf() {
    return this.modelsForm.controls;
  }

  submit() {
    let obj = this.form.value;
    if (!this.id) {
      delete obj.id;
    }
    if (this.formType == 'add') {
      let obj = this.form.value;
      obj.shipmentDetails = this.modeltypesFormList;
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
    this.router.navigate(['main/inventory/shipments/list']);
  }
  addToModelTypes() {
    this.modeltypesFormList.push({
      family: this.selectedFamily?.nameEn,
      category: this.selectedCategory?.nameEn,
      modeltype: this.selectedModelType?.nameEn,
      quantity: this.modelsForm.get('quantity').value,
      familyId: this.selectedFamily?.id,
      categoryId: this.selectedCategory?.id,
      modelTypeId: this.selectedModelType?.id,
    });
    this.modelsForm.reset();
    this.itemsFormControlsList[1].data = [];
    this.itemsFormControlsList[2].data = [];
    this.resolveModeltypesFormListIndex();
  }
  resolveModeltypesFormListIndex() {
    this.modeltypesFormList.forEach((element, index) => {
      element.index = index + 1;
    });
  }
  editmodel(model) {}
  async rowClickedAction(event) {
    const index = this.modeltypesFormList.findIndex(
      (item) =>
        item.modelTypeId == event.rowData.modelTypeId &&
        item.familyId == event.rowData.familyId &&
        item.categoryId == event.rowData.categoryId &&
        item.quantity == event.rowData.quantity
    );
    if (index !== -1) {
      this.modeltypesFormList.splice(index, 1);
    }
    if (event.action == 'editForm') {
      await this.getCategoryDropDownByFamilyId(event.rowData.familyId);
      this.getModelTypeDropDownByCategoryId(event.rowData.categoryId);
      this.selectedFamily = this.familiesList.find(
        (family) => family.id === event.rowData.familyId
      );
      this.selectedCategory = this.modelCategories.find(
        (category) => category.id === event.rowData.categoryId
      );
      this.selectedModelType = this.modeltypeList.find(
        (modelType) => modelType.id === event.rowData.modelTypeId
      );
      this.modelsForm.patchValue(event.rowData);
    }
  }
  export() {
    let obj = this.modeltypesFormList.map((item) => {
      return {
        ID: item.index,
        Family: item.family,
        Category: item.category,
        Modeltype: item.modeltype,
        Quantity: item.quantity,
      };
    });
    this.exportExcelService.exportAsExcelFile(obj, 'Units');
  }
}

export enum DDLControlType {
  Family = 'familyId',
  Category = 'categoryId',
  ModelType = 'modelTypeId',
}
