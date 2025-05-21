import { Component, OnInit } from '@angular/core';
import { SimcardsService } from '../../services/simcards.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
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
  selector: 'app-simcards-list',
  templateUrl: './simcards-list.component.html',
  styleUrls: ['./simcards-list.component.css'],
})
export class SimcardsListComponent implements OnInit {
  constructor(
    private router: Router,
    public authService: AuthService,
    public service: SimcardsService
  ) {}

  ngOnInit() {
    if (!this.authService.hasPermission('inventory-sim-cards-details')) {
      this.viewDetails = false;
    }
    if (!this.authService.hasPermission('inventory-sim-cards-export')) {
      this.tableBtns.showExport = false;
    }
    if (!this.authService.hasPermission('inventory-sim-cards-block')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Block');
      this.showBlock = false;
    }
    if (!this.authService.hasPermission('inventory-sim-cards-edit')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Edit');
      this.showEdit = false;
    }
    if (!this.authService.hasPermission('inventory-sim-cards-add')) {
      this.tableBtns.showImport = false;
    }
  }

  navigateToAdd() {
    this.router.navigate(['main/inventory/simcards/add']);
  }

  editItem(row: any): any {
    const URL = `main/inventory/simcards/edit/${row?.id}`;
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
      field: 'simSerial',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'simIMEI',
      isFixed: true,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'providers',
      isFixed: true,
      url: '/SIMCard/GetProviderDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'types',
      isFixed: true,
      url: '/SIMCard/GetTypeDropDown/11',
      method: HTTPMethods.getReq,
      propValueName: 'id',
      params: 0,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'status',
      isFixed: true,
      url: '/SIMCard/GetStatusDropDown',
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
      type: SearchInputTypes.text,
      field: 'qouta',
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
      header: 'SIM Serial',
      width: '100px',
    },
    {
      field: 'imei',
      header: 'SIM IMEI',
      width: '100px',
    },
    {
      field: 'providerName',
      header: 'Provider',
      width: '100px',
    },
    {
      field: [
        { label: 'ownerEn', custom: 'normal' },
        { label: 'ownerAr', custom: 'defaultDate' },
      ],
      header: 'Owner',
      customCell: 'multiLabel',
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
  ];

  public actions: ActionsInterface[] = [
    {
      name: 'Edit',
      icon: 'pi pi-file-edit',
      call: (row: any) => this.editItem(row),
      customPermission: (row: any) => this.showEdit,
    },
    // {
    //   name: 'Block',
    //   icon: 'pi pi-ban',
    //   call: (row: any) => this.blockItem(row),
    //   customPermission: (row: any) => this.showBlock,
    // },
  ];
  public gridActionsList: ActionsInterface[] = [
    {
      name: 'Bulk Add',
      icon: 'pi pi-file-plus',
      permission: 'inventory-sim-cards-add',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/simcard/import',
        header: 'Upload Bulk Warehouses',
        templateName: 'Import Add SIMCard Template.xlsx',
      },
    },
    {
      name: 'Bulk update',
      icon: 'pi pi-chart-bar',
      permission: 'inventory-sim-cards-add',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/simcard/ImportToUpdate',
        header: 'Update Bulk SIMCards',
        templateName: 'Import Update SIMCard Template.xlsx',
      },
    },
    {
      name: 'Import to fill data',
      icon: 'pi pi-credit-card',
      permission: 'inventory-sim-cards-add',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/simcard/ImportToFill',
        header: 'Import To Fill Data',
        templateName: 'Import Fill SIMCard Template.xlsx',
      },
    },
    // {
    //   name: 'Import to fill data',
    //   icon: 'pi pi-desktop',
    //   permission: 'inventory-sim-cards-add',
    //   call: (row: any) => this.bulkAdd(row),
    //   type: ActionsTypeEnum.File,
    //   uploadFileData: {
    //     url: '/simcard/ImportToConfigure',
    //     header: 'Import To Configure',
    //     templateName: 'Import Fill SIMCards Template.xlsx',
    //   },
    // },
  ];
  bulkAdd(row: any): any {}
  showBlock = true;
  showEdit = true;
  viewDetails = true;
  blockItem(row: any): any {}
}
