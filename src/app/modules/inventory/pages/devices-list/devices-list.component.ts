import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import {
  ActionsInterface,
  ActionsTypeEnum,
} from 'src/app/core/shared/core/modules/table/models/actions.interface';
import { DevicesService } from '../../services/devices.service';
import { SearchInterface } from 'src/app/core/shared/core/modules/table/models/search-interface';
import {
  DeviceStatusEnum,
  HTTPMethods,
  SearchInputTypes,
} from 'src/app/core/shared/core/modules/table/models/enums';
import { ConfirmationService } from 'primeng/api';
import { take } from 'rxjs';
import { WarehousesService } from '../../services/warehouses.service';

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.css'],
})
export class DevicesListComponent implements OnInit {
  conditionId: any;
  allConditions = [];
  showDecisionDialog = false;
  showCancellationDecisionDialog = false;
  isApproved = false;
  rowData: any;
  warehouseId: any;
  warehousesList = [];
  canReviewCancellation = true;
  canReturn = true;
  canDeploy = true;
  canCancel = true;
  canReplace = true;
  canReviewDelivery = true;
  showreturnToWarehouseDialog = false;
  constructor(
    private router: Router,
    public authService: AuthService,
    public service: DevicesService,
    private confirmationService: ConfirmationService,
    private warehousesService: WarehousesService
  ) {}

  ngOnInit() {
    if (!this.authService.hasPermission('inventory-devices-details')) {
      this.viewDetails = false;
    }
    if (!this.authService.hasPermission('inventory-devices-export')) {
      this.tableBtns.showExport = false;
    }
    if (!this.authService.hasPermission('inventory-devices-block')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Block');
      this.showBlock = false;
    }
    if (!this.authService.hasPermission('inventory-devices-edit')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Edit');
      this.showEdit = false;
    }
    if (!this.authService.hasPermission('inventory-devices-add')) {
      this.tableBtns.showImport = false;
    }

    if (
      !this.authService.hasPermission('inventory-devices-reviewcancellation')
    ) {
      this.canReviewCancellation = false;
    }

    if (!this.authService.hasPermission('inventory-devices-reviewdelivery')) {
      this.canReviewDelivery = false;
    }
    if (!this.authService.hasPermission('inventory-devices-managedevices')) {
      this.canDeploy = false;
    }
    if (!this.authService.hasPermission('inventory-devices-managedevices')) {
      this.canCancel = false;
    }
    if (!this.authService.hasPermission('inventory-devices-managedevices')) {
      this.canReplace = false;
    }
    if (!this.authService.hasPermission('inventory-devices-managedevices')) {
      this.canReturn = false;
    }
    this.getConditionDropDown();
    this.getWarehouseDropDown();
  }

  getConditionDropDown() {
    this.service
      .getConditionDropDown()
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.allConditions = resp.data;
        }
      });
  }
  navigateToAdd() {
    this.router.navigate(['main/inventory/devices/add']);
  }

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Navigate to the edit page of a device
   * @param row The row of the device to be edited
   */
  /*******  8e5c88ce-8d9e-4c0b-97c5-a06672d019f8  *******/
  editItem(row: any): any {
    const URL = `main/inventory/devices/edit/${row?.id}`;
    this.router.navigate([URL]);
  }

  public tableBtns: TableButtonsExistanceInterface = {
    showAllButtons: true,
    showAdd: true,
    showExport: true,
    showFilter: true,
    showImport: false,
  };

  filters: SearchInterface[] = [
    {
      type: SearchInputTypes.text,
      field: 'deviceId',
      isFixed: true,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'modelType',
      isFixed: true,
      url: '/ModelType/GetModelTypeDropDown/0',
      method: HTTPMethods.getReq,
      propValueName: 'id',
      params: 0,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'condition',
      isFixed: true,
      url: '/Device/GetConditionDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      type: SearchInputTypes.text,
      field: 'serialNumber',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'imei',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'simSerial',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'merchantId',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'terminalId',
      isFixed: true,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'status',
      isFixed: true,
      url: '/Device/GetStatusDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'errandChannel',
      isFixed: true,
      url: '/Terminal/GetAllErrandChannels',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'warehouse',
      isFixed: true,
      url: '/Warehouse/GetWarehouseDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'warehouseManager',
      isFixed: true,
      url: '/User/GetAllSystemUserDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'agent',
      isFixed: true,
      url: '/User/GetAllUsersDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      type: SearchInputTypes.choice,
      field: 'merchant',
      isFixed: true,
      url: '/Terminal/GetAllMechantDropDown',
      isMultiple: true,
      serverSide: true,
      method: HTTPMethods.postReq,
    },
    {
      isMultiple: false,
      type: SearchInputTypes.select,
      field: 'region',
      isFixed: true,
      url: '/Terminal/GetAllRegions',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: false,
      type: SearchInputTypes.select,
      field: 'city',
      isFixed: true,
      url: '/Terminal/GetAllCities',
      method: HTTPMethods.getReq,
      propValueName: 'id',
      header: '0',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'zone',
      isFixed: true,
      url: '/Terminal/GetAllZones',
      method: HTTPMethods.getReq,
      propValueName: 'id',
      header: '0',
    },
    {
      type: SearchInputTypes.text,
      field: 'shipmentId',
      isFixed: true,
    },
    /////////
  ];

  public columns: ColumnsInterface[] = [
    {
      field: 'id',
      header: 'ID',
      width: '50px',
    },

    {
      field: 'serialNumber',
      header: 'Device Serial',
      width: '100px',
    },
    {
      field: 'imei',
      header: 'IMEI',
      width: '100px',
    },
    {
      field: 'simSerial',
      header: 'SIM Serial',
      width: '100px',
    },
    {
      field: [
        { label: 'ownerEn', custom: 'normal' },
        { label: 'ownerAr', custom: 'default' },
      ],
      header: 'Owner',
      customCell: 'multiLabel',
      width: '100px',
    },
    {
      field: 'modelTypeName',
      header: 'Model Type',
      width: '100px',
    },

    {
      field: [
        { label: 'createdBy', custom: 'normal' },
        { label: 'createDate', custom: 'defaultDate' },
      ],
      header: 'Created by',
      customCell: 'multiLabel',
      width: '100px',
    },
    {
      field: 'statusName',
      header: 'Status',
      width: '100px',
    },
    {
      field: 'conditionName',
      header: 'Condition',
      width: '100px',
    },
  ];

  public actions: ActionsInterface[] = [
    {
      name: 'Edit',
      icon: 'pi pi-file-edit',
      call: (row: any) => this.editItem(row),
      customPermission: (row: any) => this.showEdit,
    },
    {
      name: 'Block',
      icon: 'pi pi-ban',
      call: (row: any) => this.blockItem(row),
      customPermission: (row: any) => this.showBlock,
    },
    {
      name: 'Approve Installation',
      icon: 'pi pi-verified',
      call: (row: any) => this.takeDecision(row, true),
      customPermission: (row: any) =>
        row.statusId == DeviceStatusEnum.InDeliveryPhase &&
        this.canReviewDelivery,
    },
    {
      name: 'Reject Installation',
      icon: 'pi pi-ban',
      call: (row: any) => this.takeDecision(row, false),
      customPermission: (row: any) =>
        row.statusId == DeviceStatusEnum.InDeliveryPhase &&
        this.canReviewDelivery,
    },
    {
      name: 'Approve Cancellation',
      icon: 'pi pi-undo',
      call: (row: any) => this.takeCancellationDecision(row, true),
      customPermission: (row: any) =>
        row.statusId == DeviceStatusEnum.InCancellationPhase &&
        this.canReviewCancellation,
    },
    {
      name: 'Reject Cancellation',
      icon: 'pi pi-ban',
      call: (row: any) => this.takeCancellationDecision(row, false),
      customPermission: (row: any) =>
        row.statusId == DeviceStatusEnum.InCancellationPhase &&
        this.canReviewCancellation,
    },

    {
      name: 'History',
      icon: 'pi pi-history',
      call: (row: any) => this.gotoHistory(row),
      customPermission: (row: any) => true,
    },
    {
      name: 'Deploy',
      icon: 'pi pi-table',
      call: (row: any) => this.goToDeployPage(row, true),
      customPermission: (row: any) => this.canDeploy,
    },
    {
      name: 'Cancel',
      icon: 'pi pi-minus-circle',
      call: (row: any) => this.goToCancelPage(row, true),
      customPermission: (row: any) => this.canCancel,
    },
    {
      name: 'Replace',
      icon: 'pi pi-arrow-right-arrow-left',
      call: (row: any) => this.goToReplacePage(row, true),
      customPermission: (row: any) => this.canReplace,
    },
    {
      name: 'Return to Warehouse',
      icon: 'pi pi-undo',
      call: (row: any) => this.returnToWarehouseDialoge(row),
      customPermission: (row: any) => this.canReturn,
    },
    {
      name: 'Actions History',
      icon: 'pi pi-history',
      call: (row: any) => this.goToActionsHistoryPage(row, true),
      customPermission: (row: any) => this.canReplace,
    },
  ];
  public gridActionsList: ActionsInterface[] = [
    {
      name: 'Bulk Add',
      icon: 'pi pi-file-plus',
      permission: 'inventory-devices-add',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/Device/import',
        header: 'Upload Bulk Devices',
        templateName: 'Import Add Device Template.xlsx',
      },
    },
    {
      name: 'Bulk update',
      icon: 'pi pi-chart-bar',
      permission: 'inventory-devices-add',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/Device/ImportToUpdate',
        header: 'Update Bulk Devices',
        templateName: 'Import Update Device.xlsx',
      },
    },
    {
      name: 'Import to fill data',
      icon: 'pi pi-credit-card',
      permission: 'inventory-devices-add',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/Device/ImportToFill',
        header: 'Import To Fill Data',
        templateName: 'Import Fill Device Template.xlsx',
      },
    },
    {
      name: 'Import To Configure',
      icon: 'pi pi-desktop',
      permission: 'inventory-devices-add',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/Device/ImportToConfigure',
        header: 'Import To Configure',
        templateName: 'Import Configure Device Template.xlsx',
      },
    },
  ];
  bulkAdd(row: any): any {}
  showBlock = true;
  showEdit = true;
  viewDetails = true;
  blockItem(row: any): any {}

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

  takeDecision(rowData, isApproved) {
    if (rowData) {
      this.isApproved = isApproved;
      this.rowData = rowData;
      this.showDecisionDialog = true;
      this.conditionId = rowData.conditionId;
    }
  }
  takeAction() {
    let data = {
      deviceId: this.rowData.id,
      actionId: this.isApproved ? 1 : 2,
      conditionId: this.conditionId,
    };
    this.service
      .reviewDelivery(data)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.rowData.statusName = this.isApproved
            ? 'Installed'
            : 'Spare With Agent';
          this.rowData.statusId = this.rowData.statusId = this.isApproved
            ? DeviceStatusEnum.Installed
            : DeviceStatusEnum.SpareWithAgent;
          this.showDecisionDialog = false;
          this.conditionId = null;
        }
      });
  }

  takeCancellationDecision(rowData, isApproved) {
    if (rowData) {
      this.isApproved = isApproved;
      this.rowData = rowData;
      this.showCancellationDecisionDialog = true;
      this.conditionId = rowData.conditionId;
    }
  }

  reviewCancellation() {
    let data = {
      deviceId: this.rowData.id,
      actionId: this.isApproved ? 1 : 2,
      conditionId: this.conditionId,
      warehouseId: this.warehouseId,
    };
    this.service
      .reviewCancellation(data)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.rowData.statusName = this.isApproved
            ? 'In Warehouse'
            : 'Installed';
          this.rowData.statusId = this.rowData.statusId = this.isApproved
            ? DeviceStatusEnum.InWarehouse
            : DeviceStatusEnum.Installed;
          this.showCancellationDecisionDialog = false;
          this.conditionId = null;
        }
      });
  }
  gotoHistory(row: any): any {
    const URL = `main/inventory/devices/history/${row?.id}/${row?.serialNumber}`;
    this.router.navigate([URL]);
  }

  returnToWarehouseDialoge(row: any): any {
    if (row) {
      this.rowData = row;
      this.showreturnToWarehouseDialog = true;
    }
  }
  returnToWarehouse() {
    let data = {
      deviceId: this.rowData.id,
      warehouseId: this.warehouseId,
      conditionId: this.conditionId,
    };
    this.service
      .returnToWarehouse(data)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          this.rowData.statusName = 'In Warehouse';
          this.rowData.statusId = DeviceStatusEnum.InWarehouse;
          this.showreturnToWarehouseDialog = false;
          const condition = this.allConditions.find(
            (x) => x.id == this.conditionId
          );
          if (condition) {
            this.rowData.conditionName = condition.nameEn;
          }
          this.warehouseId = null;
          this.conditionId = null;
        }
      });
  }
  goToCancelPage(row: any, arg1: boolean): any {
    const URL = `main/inventory/devices/cancel/${row?.id}`;
    this.router.navigate([URL]);
  }
  goToDeployPage(row: any, arg1: boolean): any {
    const URL = `main/inventory/devices/deploy/${row?.id}`;
    this.router.navigate([URL]);
  }
  goToReplacePage(row: any, arg1: boolean): any {
    const URL = `main/inventory/devices/replace/${row?.id}`;
    this.router.navigate([URL]);
  }

  goToActionsHistoryPage(row: any, arg1: boolean): any {
    const URL = `main/inventory/devices/actionshistory/${row?.id}`;
    this.router.navigate([URL]);
  }
}
