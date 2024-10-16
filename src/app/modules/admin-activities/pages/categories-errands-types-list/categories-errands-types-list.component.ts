import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActionsInterface } from 'src/app/core/shared/core/modules/table/models/actions.interface';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { ErrandTypeService } from '../../services/errand-type.service';

@Component({
  selector: 'oc-categories-errands-types-list',
  templateUrl: './categories-errands-types-list.component.html',
  styleUrls: ['./categories-errands-types-list.component.scss'],
})
export class CategoriesErrandsTypesListComponent implements OnInit {
  editItem(row: any): any {
    const URL = `main/admin-activities/categories-errands-types/edit/${row?.id}`;
    this.router.navigate([URL]);
  }

  public tableBtns: TableButtonsExistanceInterface = {
    showAllButtons: true,
    showAdd: true,
    showExport: true,
    showFilter: false,
    showImport: true,
  };
  public columns: ColumnsInterface[] = [
    {
      field: 'id',
      header: 'ID',
      width: '50px',
    },
    {
      field: 'categoryName',
      header: 'Category',
    },
    {
      field: 'nameEn',
      header: 'Type Name En',
    },
    {
      field: 'nameAr',
      header: 'Type Name Ar',
    },
    {
      field: 'requireQuantity',
      header: 'Require Qty?',
    },
    {
      field: 'status',
      header: 'Status',
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

  // filters: SearchInterface[] = [
  //   {
  //     type: SearchInputTypes.text,
  //     field: 'nameEn',
  //     isFixed: true,
  //   },
  //   {
  //     type: SearchInputTypes.text,
  //     field: 'nameAr',
  //     isFixed: true,
  //   },
  //   {
  //     type: SearchInputTypes.text,
  //     field: 'requireQuantity',
  //     isFixed: true,
  //   },
  //   {
  //     type: SearchInputTypes.text,
  //     field: 'status',
  //     isFixed: true,
  //   },
  //   {
  //     type: SearchInputTypes.date,
  //     field: 'createDate',
  //     isFixed: true,
  //   },
  // ];
  showBlock = true;
  showEdit = true;
  constructor(
    private router: Router,
    public authService: AuthService,
    public service: ErrandTypeService
  ) {}

  ngOnInit() {
    if (
      !this.authService.hasPermission('admin-activities-errand-types-export')
    ) {
      this.tableBtns.showExport = false;
    }
    if (
      !this.authService.hasPermission('admin-activities-errand-types-block')
    ) {
      this.showBlock = false;
      // this.actions = this.actions.filter((x) => x.name !== 'Block');
    }
    if (!this.authService.hasPermission('admin-activities-errand-types-edit')) {
      // this.actions = this.actions.filter((x) => x.name !== 'Edit');
      this.showEdit = false;
    }
    if (!this.authService.hasPermission('admin-activities-errand-types-add')) {
      this.tableBtns.showImport = false;
    }
  }
  navigateToAdd() {
    this.router.navigate([
      'main/admin-activities/categories-errands-types/add',
    ]);
  }
}
