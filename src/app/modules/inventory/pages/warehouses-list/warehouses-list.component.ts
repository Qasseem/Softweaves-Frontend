import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  ActionsInterface,
  ActionsTypeEnum,
} from 'src/app/core/shared/core/modules/table/models/actions.interface';
import {
  HTTPMethods,
  SearchInputTypes,
} from 'src/app/core/shared/core/modules/table/models/enums';
import { SearchInterface } from 'src/app/core/shared/core/modules/table/models/search-interface';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { WarehousesService } from '../../services/warehouses.service';

@Component({
  selector: 'app-warehouses-list',
  templateUrl: './warehouses-list.component.html',
  styleUrls: ['./warehouses-list.component.css'],
})
export class WarehousesListComponent implements OnInit {
  constructor(
    private router: Router,
    public authService: AuthService,
    public service: WarehousesService
  ) {}

  ngOnInit() {
    if (!this.authService.hasPermission('inventory-warehouses-export')) {
      this.tableBtns.showExport = false;
    }
    if (!this.authService.hasPermission('inventory-warehouses-block')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Block');
      this.showBlock = false;
    }
    if (!this.authService.hasPermission('inventory-warehouses-edit')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Edit');
      this.showEdit = false;
    }
    if (!this.authService.hasPermission('inventory-warehouses-add')) {
      this.tableBtns.showImport = false;
    }
  }

  navigateToAdd() {
    this.router.navigate(['main/inventory/warehouses/add']);
  }

  editItem(row: any): any {
    const URL = `main/inventory/warehouses/edit/${row?.id}`;
    this.router.navigate([URL]);
  }

  public tableBtns: TableButtonsExistanceInterface = {
    showAllButtons: true,
    showAdd: true,
    showExport: true,
    showFilter: false,
    showImport: false,
  };
  public columns: ColumnsInterface[] = [
    {
      field: 'id',
      header: 'ID',
      width: '50px',
    },

    {
      field: 'warehouseName',
      header: 'Waehouse Name',
      width: '200px',
    },
    {
      field: 'managersName',
      header: 'Warehouse Managers',
      width: '200px',
    },
    {
      field: [
        { label: 'createdBy', custom: 'normal' },
        { label: 'createdAt', custom: 'defaultDate' },
      ],
      header: 'Created by',
      customCell: 'multiLabel',
      width: '200px',
    },
  ];

  public gridActionsList: ActionsInterface[] = [
    {
      name: 'Bulk Add',
      icon: 'pi pi-file-plus',
      permission: 'inventory-warehouses-add',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/warehouse/import',
        header: 'Upload Bulk Warehouses',
        templateName: 'Import Warehouse Template.xlsx',
      },
      // customPermission: (row: any) => row.id > 3,
    },
  ];
  bulkAdd(row: any): any {}
  showBlock = true;
  showEdit = true;
}
