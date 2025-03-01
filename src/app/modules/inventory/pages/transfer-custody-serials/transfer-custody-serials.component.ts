import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferCustodyService } from '../../services/transfer-custody.service';
import { concatMap, take, tap } from 'rxjs';
import { WarehousesService } from '../../services/warehouses.service';
import { ExportExcelService } from 'src/app/modules/shared/Services/export-excel.service';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { UserService } from 'src/app/modules/user-management/services/user.service';
import { ShipmentsService } from '../../services/shipments.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-transfer-custody-serials',
  templateUrl: './transfer-custody-serials.component.html',
  styleUrls: ['./transfer-custody-serials.component.css'],
})
export class TransferCustodySerialsComponent implements OnInit {
  form: FormGroup;
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
  serial;
  custodySourceFormControlsList = [
    {
      name: 'source',
      header: 'From',
      data: [
        { id: 1, nameEn: 'Warehouse', nameAr: 'warehouse' },
        { id: 3, nameEn: 'Custody', nameAr: 'Custody' },
      ],
      showCtrl: true,
    },
    {
      name: 'destination',
      header: 'To',
      data: [
        { id: 1, nameEn: 'Warehouse', nameAr: 'warehouse' },
        { id: 2, nameEn: 'Employee', nameAr: 'Employee' },
      ],
      showCtrl: true,
    },
    {
      name: 'fromId',
      header: 'Source',
      data: [],
      showCtrl: true,
    },
    {
      name: 'toId',
      header: 'Destination',
      data: [],
      showCtrl: true,
    },
  ];
  selectedModelType: any;
  selectedFamily: any;
  selectedCategory: any;
  agentWarehousesList = [];
  usersList = [];
  userId: string;
  constructor(
    private fb: FormBuilder,
    private service: TransferCustodyService,
    private router: Router,
    private route: ActivatedRoute,
    private warehousesService: WarehousesService,
    private exportExcelService: ExportExcelService,
    private userService: UserService,
    private shipmentService: ShipmentsService,
    public storage: StorageService
  ) {
    this.formType = this.route.snapshot.data.type;
    this.userId = this.storage.getStringItem('userId');
  }

  public columns: ColumnsInterface[] = [
    {
      field: 'id',
      header: 'NO.',
      width: '50px',
    },

    {
      field: 'modelFamily',
      header: 'Inventory Family',
      width: '200px',
    },
    {
      field: 'modelCategory',
      header: 'Category',
      width: '200px',
    },
    {
      field: 'modelType',
      header: 'Device/Item',
      width: '200px',
    },
    {
      field: 'quantity',
      header: 'QTY',
      width: '200px',
    },
  ];

  public serialColumns: ColumnsInterface[] = [
    {
      field: 'id',
      header: 'NO.',
      width: '50px',
    },

    {
      field: 'modelFamily',
      header: 'Inventory Family',
      width: '200px',
    },
    {
      field: 'modelCategory',
      header: 'Category',
      width: '200px',
    },
    {
      field: 'modelType',
      header: 'Device/Item',
      width: '200px',
    },
    {
      field: 'serialNumber',
      header: 'Serial Number',
      width: '200px',
    },
    {
      field: 'IMEI',
      header: 'imei',
      width: '200px',
    },
    {
      field: 'quantity',
      header: 'QTY',
      width: '200px',
    },
  ];

  ngOnInit() {
    this.form = this.fb.group({
      source: [null],
      destination: [null],
      isFromWarehouse: [null],
      isToWarehouse: [null],
      fromId: [null, [Validators.required]],
      toId: [null, [Validators.required]],
      notes: [null],
      id: [null],
    });

    this.getLookupsDropdowns();
  }
  getLookupsDropdowns() {
    this.callApisSequentially();
  }
  getDetails() {
    if (this.formType == 'serials') {
      this.id = this.route.snapshot.params.id || null;
      if (this.id) {
        this.getItemDetails();
      }
    }
  }
  callApisSequentially() {
    this.warehousesService
      .getAgentWarehouseDropDown()
      .pipe(
        tap((data1) => (this.agentWarehousesList = data1.data)),
        concatMap(() => this.warehousesService.getWarehouseDropDown()),
        tap((data2) => (this.warehousesList = data2.data)),
        concatMap(() => this.userService.getAllServiceAgents()),
        tap((data3) => {
          this.usersList = [...data3.data];
          this.getDetails();
        })
      )
      .subscribe({
        next: () => {},
        error: (error) => {},
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
            this.distributeDetails(this.details);
            // this.form.get('modelCategoryId').setValue(this.details.categoryId);
          }
        }
      });
  }
  distributeDetails(transferCustodyDetails) {
    const { details, isFromWarehouse, isToWarehouse } = transferCustodyDetails;
    this.modeltypesFormList = details;

    this.form.controls.source.setValue(
      isFromWarehouse ? DDLControlType.Warehouse : DDLControlType.Custody
    );
    this.form.controls.destination.setValue(
      isToWarehouse ? DDLControlType.Warehouse : DDLControlType.Employee
    );

    const sourceOption = {
      value: isFromWarehouse
        ? DDLControlType.Warehouse
        : DDLControlType.Custody,
    };
    this.custodySourcesChanged(sourceOption, DDLControlType.Source);

    const destinationOption = {
      value: isToWarehouse ? DDLControlType.Warehouse : DDLControlType.Employee,
    };
    this.custodySourcesChanged(destinationOption, DDLControlType.Destination);

    this.form.patchValue(transferCustodyDetails);
    this.form.controls.source.disable();
    this.form.controls.destination.disable();
    this.form.controls.fromId.disable();
    this.form.controls.toId.disable();
  }

  custodySourcesChanged(selectedOption: any, controlName: DDLControlType) {
    if (!selectedOption) return;
    switch (controlName) {
      case DDLControlType.Source:
        this.form.controls.fromId.setValue(null);
        if (selectedOption?.value == DDLControlType.Warehouse) {
          this.custodySourceFormControlsList[2].data = [
            ...this.agentWarehousesList,
          ];
          this.custodySourceFormControlsList[2].showCtrl = true;
          this.custodySourceFormControlsList[2].header = 'Warehouse';
          this.form.controls.isFromWarehouse.setValue(true);
        } else if (selectedOption?.value == DDLControlType.Custody) {
          this.form.controls.isFromWarehouse.setValue(false);
          this.form.controls.fromId.setValue(+this.userId);
          this.custodySourceFormControlsList[2].showCtrl = false;
        }
        break;
      case DDLControlType.Destination:
        this.form.controls.toId.setValue(null);
        if (selectedOption?.value == DDLControlType.Warehouse) {
          this.form.controls.isToWarehouse.setValue(true);
          this.custodySourceFormControlsList[3].data = [...this.warehousesList];
          this.custodySourceFormControlsList[3].header = 'Warehouse';
        } else if (selectedOption?.value == DDLControlType.Employee) {
          this.form.controls.isToWarehouse.setValue(false);
          this.custodySourceFormControlsList[3].data = [...this.usersList];
          this.custodySourceFormControlsList[3].header = 'Employee';
        }
        break;
    }
  }
  resetForm() {
    this.modeltypesFormList = [];
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    let obj = this.form.getRawValue();
    obj.details = this.modeltypesFormList;
    if (!this.id) {
      delete obj.id;
    }
    if (this.formType == 'add') {
      this.service
        .add(obj)
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            if (resp.success) {
              this.backToList();
            }
          },
        });
    } else {
      obj.details = this.modeltypesFormList;
      this.service
        .update(obj)
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
    this.router.navigate(['main/inventory/transfercustody/list']);
  }

  resolveModeltypesFormListIndex() {
    this.modeltypesFormList.forEach((element, index) => {
      element.id = index + 1;
    });
  }
  addSerialModelTypes() {}
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
  }
  export() {
    let obj = this.modeltypesFormList.map((item) => {
      return {
        ID: item.id,
        Family: item.modelFamily,
        Category: item.modelCategory,
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
  Source = 'source',
  Destination = 'destination',
  Warehouse = 1,
  Employee = 2,
  Custody = 3,
}
