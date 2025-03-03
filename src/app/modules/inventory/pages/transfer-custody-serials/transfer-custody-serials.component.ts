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
import { ToastService } from 'src/app/core/services/toaster.service';

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
  serlialList = [];
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
  summaryList = [];
  isAllAddesd: boolean;
  selectedFile: File;
  constructor(
    private fb: FormBuilder,
    private service: TransferCustodyService,
    private router: Router,
    private route: ActivatedRoute,
    private warehousesService: WarehousesService,
    private exportExcelService: ExportExcelService,
    private userService: UserService,
    private shipmentService: ShipmentsService,
    public storage: StorageService,
    private toaster: ToastService
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
      field: 'imei',
      header: 'IMEI',
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
    this.summaryList = transferCustodyDetails.details.filter(
      (item) => item.requireSerial
    );
    this.summaryList.map((item) => (item.added = 0));
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
    obj.serials = this.serlialList;
    obj.transferId = +this.id;
    this.service
      .completeData(obj)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.backToList();
        }
      });
  }
  backToList() {
    this.router.navigate(['main/inventory/transfercustody/list']);
  }

  resolveModeltypesFormListIndex() {
    this.serlialList.forEach((element, index) => {
      element.id = index + 1;
    });
  }

  addSerialModelTypes() {
    if (
      this.serlialList.findIndex((item) => item.serialNumber == this.serial) !=
      -1
    ) {
      this.toaster.showError('Serial already added');
      return;
    }

    let obj = {
      transferId: this.id,
      searchKey: this.serial,
    };
    this.service
      .addSerialManually(obj)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          if (resp.data.errorMessage) {
            this.toaster.showError(resp.data.errorMessage);
          } else {
            // this.serlialList.push(resp.data);
            this.addSerialToList(resp.data);
          }
        }
      });
  }
  addSerialToList(data: any) {
    if (
      this.serlialList.findIndex(
        (item) => item.serialNumber == data.serialNumber
      ) != -1
    ) {
      this.toaster.showError('Serial already added');
      return;
    }

    let index = this.summaryList.findIndex(
      (item) =>
        item.categoryId == data.categoryId &&
        item.familyId == data.familyId &&
        item.modelTypeId == data.modelTypeId
    );

    if (index !== -1) {
      if (
        +this.summaryList[index]?.added < +this.summaryList[index]?.quantity
      ) {
        this.summaryList[index].added = +this.summaryList[index]?.added + 1;
        this.serlialList.push(data);
      } else {
        this.toaster.showError('Serials for this model type already added');
        return;
      }
    }
    this.resolveModeltypesFormListIndex();
    this.checkIfAllAdded();
  }
  checkIfAllAdded() {
    ////Check if all model types quantity is equla to added quantity
    if (
      this.summaryList.findIndex((item) => +item.added < +item.quantity) == -1
    ) {
      this.summaryList.forEach((item) => {
        item.added = item.quantity;
      });
      this.toaster.showSuccess(
        'All serials for this transfer are added successfully'
      );
      this.isAllAddesd = true;
    }
  }

  editmodel(model) {}
  async rowClickedAction(event) {
    const itemIndex = this.serlialList.findIndex(
      (item) =>
        item.modelTypeId == event.rowData.modelTypeId &&
        item.familyId == event.rowData.familyId &&
        item.categoryId == event.rowData.categoryId &&
        item.quantity == event.rowData.quantity
    );
    if (itemIndex !== -1) {
      this.serlialList.splice(itemIndex, 1);

      let index = this.summaryList.findIndex(
        (item) =>
          item.categoryId == event.rowData.categoryId &&
          item.familyId == event.rowData.familyId &&
          item.modelTypeId == event.rowData.modelTypeId
      );

      if (index !== -1) {
        this.summaryList[index].added = +this.summaryList[index]?.added - 1;
      }
    }
  }
  export() {
    let obj = this.modeltypesFormList.map((item) => {
      return {
        ID: item.id,
        Family: item.modelFamily,
        Category: item.modelCategory,
        Modeltype: item.modelType,
        Quantity: item.quantity,
      };
    });
    this.exportExcelService.exportAsExcelFile(obj, 'Units');
  }

  exportSerials() {
    let obj = this.serlialList.map((item) => {
      return {
        ID: item.id,
        Family: item.family,
        Category: item.category,
        Modeltype: item.modelType,
        serialNumber: item.serialNumber,
        IMEI: item.imei,
        Quantity: item.quantity,
      };
    });
    this.exportExcelService.exportAsExcelFile(obj, 'Units');
  }

  import() {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadFile();
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.toaster.showError('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('id', this.id);
    formData.append('items', JSON.stringify(this.serlialList)); // Convert array to JSON string

    this.service
      .import(formData)
      .pipe(take(1))
      .subscribe((response) => {
        response.data?.successData?.forEach((item: any) => {
          this.addSerialToList(item);
        });
        if (response.data.failureData?.length > 0) {
          this.toaster.showWarning('Some serials are not imported');
        }
      });
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
