import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { TransferCustodyService } from '../../services/transfer-custody.service';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { SearchInterface } from 'src/app/core/shared/core/modules/table/models/search-interface';
import {
  HTTPMethods,
  SearchInputTypes,
  TransferStatusEnum,
} from 'src/app/core/shared/core/modules/table/models/enums';
import { ActionsInterface } from 'src/app/core/shared/core/modules/table/models/actions.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { ConfirmationService } from 'primeng/api';
import { take } from 'rxjs';

@Component({
  selector: 'app-transfer-custody-list',
  templateUrl: './transfer-custody-list.component.html',
  styleUrls: ['./transfer-custody-list.component.css'],
})
export class TransferCustodyListComponent implements OnInit {
  constructor(
    private router: Router,
    public authService: AuthService,
    public service: TransferCustodyService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    if (!this.authService.hasPermission('inventory-transfer-custody-details')) {
      this.viewDetails = false;
    }
    if (!this.authService.hasPermission('inventory-transfer-custody-export')) {
      this.tableBtns.showExport = false;
    }
    if (!this.authService.hasPermission('inventory-transfer-custody-block')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Block');
      this.showBlock = false;
    }
    if (!this.authService.hasPermission('inventory-transfer-custody-edit')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Edit');
      this.showEdit = false;
    }
    if (!this.authService.hasPermission('inventory-transfer-custody-add')) {
      this.tableBtns.showImport = false;
    }
  }

  navigateToAdd() {
    this.router.navigate(['main/inventory/transfercustody/add']);
  }

  editItem(row: any): any {
    const URL = `main/inventory/transfercustody/edit/${row?.id}`;
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
      isMultiple: true,
      type: SearchInputTypes.date,
      field: 'createDate',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'transferId',
      isFixed: true,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'fromWarehouse',
      isFixed: true,
      url: '/Warehouse/GetWarehouseDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'toWarehouse',
      isFixed: true,
      url: '/Warehouse/GetWarehouseDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'fromEmployee',
      isFixed: true,
      url: '/User/GetAllSystemUserDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'toEmployee',
      isFixed: true,
      url: '/User/GetAllSystemUserDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
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
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'city',
      isFixed: true,
      url: '/Terminal/GetAllCities',
      method: HTTPMethods.getReq,
      propValueName: 'id',
      header: '0',
    },
    // {
    //   isMultiple: true,
    //   type: SearchInputTypes.select,
    //   field: 'zone',
    //   isFixed: true,
    //   url: '/Terminal/GetAllZones',
    //   method: HTTPMethods.getReq,
    //   propValueName: 'id',
    //   header: '0',
    // },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'team',
      isFixed: true,
      url: '/Device/GetTeamDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'status',
      isFixed: true,
      url: '/transfer/GetStatusDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'createdBy',
      isFixed: true,
      url: '/User/GetAllSystemUserDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
  ];

  public columns: ColumnsInterface[] = [
    {
      field: 'id',
      header: 'ID',
      width: '50px',
    },

    {
      field: 'from',
      header: 'From',
      width: '100px',
    },
    {
      field: 'to',
      header: 'To',
      width: '100px',
    },
    {
      field: 'status',
      header: 'Status',
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
  ];

  public actions: ActionsInterface[] = [
    {
      name: 'Edit',
      icon: 'pi pi-file-edit',
      call: (row: any) => this.editItem(row),
      customPermission: (row: any) => this.showEdit && row.allowToEdit,
    },
    {
      name: 'Block',
      icon: 'pi pi-ban',
      call: (row: any) => this.blockItem(row),
      customPermission: (row: any) =>
        this.showBlock &&
        row.statusId != TransferStatusEnum.Approved &&
        row.statusId != TransferStatusEnum.Rejected,
    },
    {
      name: 'Approve',
      icon: 'pi pi-file-check',
      call: (row: any) => this.ShowDialog(row, true),
      customPermission: (row: any) =>
        row.statusId == TransferStatusEnum.InProgress && row.allowToReceive,
    },
    {
      name: 'Reject',
      icon: 'pi pi-ban',
      call: (row: any) => this.ShowDialog(row, false),
      customPermission: (row: any) =>
        row.statusId == TransferStatusEnum.InProgress && row.allowToReceive,
    },
    {
      name: 'Add Serials',
      icon: 'pi pi-server',
      call: (row: any) => this.addSerials(row),
      customPermission: (row: any) => this.showEdit && row.allowToEdit,
    },
  ];

  addSerials(row: any): any {
    const URL = `main/inventory/transfercustody/serials/${row?.id}`;
    this.router.navigate([URL]);
  }
  bulkAdd(row: any): any {}
  showBlock = true;
  showEdit = true;
  viewDetails = true;
  blockItem(row: any): any {}

  ShowDialog(rowData, isApproved) {
    if (rowData) {
      const isBlock = !rowData.isBlock;
      let message =
        'are you sure you want to ' +
        (isApproved ? 'approve' : 'reject') +
        ' this transfer?';
      this.confirmationService.confirm({
        header: isApproved ? 'Approve' : 'Reject',
        message: message,
        acceptIcon: 'pi pi-check mr-2',
        rejectIcon: 'pi pi-times mr-2',
        rejectButtonStyleClass: 'p-button-sm',
        acceptButtonStyleClass: 'p-button-outlined p-button-sm',
        accept: () => {
          this.takeAction(rowData, isApproved);
        },
        reject: () => {},
        key: 'myDialog',
        acceptLabel: `Yes, ${isApproved ? 'Approve' : 'Reject'}`,
        rejectLabel: 'No, Cancel',
      });
    }
  }
  takeAction(rowData, isApproved: boolean) {
    let obj = {
      transferId: rowData.id,
      decisionId: isApproved ? 1 : 2,
    };
    this.service
      .completeTransfer(obj)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.success) {
          rowData.status = isApproved ? 'Approved' : 'Rejected';
          rowData.statusId = isApproved
            ? TransferStatusEnum.Approved
            : TransferStatusEnum.Rejected;
        }
      });
  }
}
