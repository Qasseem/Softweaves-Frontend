import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModeltypesService } from '../../services/modeltypes.service';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import {
  ActionsInterface,
  ActionsTypeEnum,
} from 'src/app/core/shared/core/modules/table/models/actions.interface';

@Component({
  selector: 'app-model-types-list',
  templateUrl: './model-types-list.component.html',
  styleUrls: ['./model-types-list.component.css'],
})
export class ModelTypesListComponent implements OnInit {
  bulkAdd(row: any): any {}
  constructor(
    private router: Router,
    public authService: AuthService,
    public service: ModeltypesService
  ) {}

  ngOnInit() {
    if (!this.authService.hasPermission('inventory-model-types-export')) {
      this.tableBtns.showExport = false;
    }
    if (!this.authService.hasPermission('inventory-model-types-block')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Block');
      this.showBlock = false;
    }
    if (!this.authService.hasPermission('inventory-model-types-edit')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Edit');
      this.showEdit = false;
    }
    if (!this.authService.hasPermission('inventory-model-types-add')) {
      this.tableBtns.showImport = false;
    }
  }

  navigateToAdd() {
    this.router.navigate(['main/inventory/modeltypes/add']);
  }

  editItem(row: any): any {
    const URL = `main/inventory/modeltypes/edit/${row?.id}`;
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
      field: 'categoryName',
      header: 'Model Category',
      width: '200px',
    },
    {
      field: 'modelTypeName',
      header: 'Model Type',
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

  public actions: ActionsInterface[] = [
    {
      name: 'Edit',
      icon: 'pi pi-file-edit',
      permission: 'viewcustomerpayments',
      call: (row: any) => this.editItem(row),
      // customPermission: (row: any) => row.id > 3,
    },
  ];

  public gridActionsList: ActionsInterface[] = [
    {
      name: 'Bulk Add',
      icon: 'pi pi-file-plus',
      permission: 'inventory-model-types-add',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/modeltype/import',
        header: 'Upload Bulk Model Types',
        templateName: 'Import Model Type Template.xlsx',
      },
      // customPermission: (row: any) => row.id > 3,
    },
  ];

  showBlock = true;
  showEdit = true;
}
