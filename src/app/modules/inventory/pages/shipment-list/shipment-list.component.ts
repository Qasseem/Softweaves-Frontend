import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ShipmentsService } from '../../services/shipments.service';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { SearchInterface } from 'src/app/core/shared/core/modules/table/models/search-interface';
import {
  HTTPMethods,
  SearchInputTypes,
} from 'src/app/core/shared/core/modules/table/models/enums';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import {
  ActionsInterface,
  ActionsTypeEnum,
} from 'src/app/core/shared/core/modules/table/models/actions.interface';

@Component({
  selector: 'app-shipment-list',
  templateUrl: './shipment-list.component.html',
  styleUrls: ['./shipment-list.component.css'],
})
export class ShipmentListComponent implements OnInit {
  constructor(
    private router: Router,
    public authService: AuthService,
    public service: ShipmentsService
  ) {}

  ngOnInit() {
    if (!this.authService.hasPermission('inventory-shipments-details')) {
      this.viewDetails = false;
    }
    if (!this.authService.hasPermission('inventory-shipments-export')) {
      this.tableBtns.showExport = false;
    }
    if (!this.authService.hasPermission('inventory-shipments-block')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Block');
      this.showBlock = false;
    }
    if (!this.authService.hasPermission('inventory-shipments-edit')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Edit');
      this.showEdit = false;
    }
    if (!this.authService.hasPermission('inventory-shipments-add')) {
      this.tableBtns.showImport = false;
    }
  }

  navigateToAdd() {
    this.router.navigate(['main/inventory/shipments/add']);
  }
  e;

  editItem(row: any): any {
    const URL = `main/inventory/shipments/edit/${row?.id}`;
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
      type: SearchInputTypes.date,
      field: 'createDate',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'supplier',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'shipmentId',
      isFixed: true,
    },
    {
      type: SearchInputTypes.date,
      field: 'shipmentDate',
      isFixed: true,
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
      field: 'createdBy',
      isFixed: true,
      url: '/User/GetAllUsersDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
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
      field: 'supplier',
      header: 'Supplier',
      width: '100px',
    },
    {
      field: 'shipmentId',
      header: 'Shipment ID',
      width: '100px',
    },
    {
      field: 'shipmentDate',
      header: 'Shipment Date',
      width: '100px',
      customCell: 'date',
    },
    {
      field: 'warehouseName',
      header: 'Warehouse',
      width: '100px',
    },

    {
      field: [
        { label: 'creator', custom: 'normal' },
        { label: 'createDate', custom: 'defaultDate' },
      ],
      header: 'Created by',
      customCell: 'multiLabel',
      width: '100px',
    },
  ];

  // public actions: ActionsInterface[] = [
  //   {
  //     name: 'Edit',
  //     icon: 'pi pi-file-edit',
  //     call: (row: any) => this.editItem(row),
  //     customPermission: (row: any) => this.showEdit,
  //   },
  //   {
  //     name: 'Block',
  //     icon: 'pi pi-ban',
  //     call: (row: any) => this.blockItem(row),
  //     customPermission: (row: any) => this.showBlock,
  //   },
  // ];
  // public gridActionsList: ActionsInterface[] = [
  //   {
  //     name: 'Bulk Add',
  //     icon: 'pi pi-file-plus',
  //     permission: 'inventory-shipments-add',
  //     call: (row: any) => this.bulkAdd(row),
  //     type: ActionsTypeEnum.File,
  //     uploadFileData: {
  //       url: '/Shipment/import',
  //       header: 'Upload Bulk Shipments',
  //       templateName: 'Import Add Shipment Template.xlsx',
  //     },
  //   },
  // ];
  bulkAdd(row: any): any {}
  showBlock = true;
  showEdit = true;
  viewDetails = true;
  blockItem(row: any): any {}
}
