import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { MerchantService } from '../../services/merchant.service';
import { DialogService } from 'src/app/services/dialog.service';
import { takeWhile } from 'rxjs';
import { ToastService } from 'src/app/core/services/toaster.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'oc-merchant-list',
  templateUrl: './merchant-list.component.html',
  styleUrls: ['./merchant-list.component.scss'],
})
export class MerchantListComponent implements OnInit {
  alive: boolean = true;
  reloadIfUpdated = false;
  public tableBtns: TableButtonsExistanceInterface = {
    showAllButtons: true,
    showAdd: true,
    showExport: true,
    showFilter: true,
    showImport: true,
  };
  public columns: ColumnsInterface[] = [
    {
      field: 'reference',
      header: 'Ref',
      width: '50px',
    },
    {
      field: 'merchantId',
      header: 'ID',
      width: '50px',
    },

    {
      field: [
        { label: 'merchantNameEN', custom: 'navigator' },
        { label: 'merchantNameAR', custom: 'default' },
      ],
      header: 'Name',
      customCell: 'multiLabel',
      link: 'main/merchant/details/',
      width: '200px',
    },
    {
      field: 'userName',
      header: 'User Name',
      width: '110px',
    },
    {
      field: 'category',
      header: 'Category',
      width: '110px',
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
    {
      name: 'Block',
      icon: 'pi pi-ban',
      permission: 'completedata',
      call: (row: any) => this.toggleBlockItem(row),
    },

    {
      name: 'Add to favorites',
      icon: 'pi pi-heart',
      permission: 'completedata',
      call: (row: any) => this.addToFavorite(row),
    },
  ];

  filters: SearchInterface[] = [
    {
      type: SearchInputTypes.text,
      field: 'MerchantNameEN',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'MerchantNameAR',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'UserName',
      isFixed: true,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'category',
      isFixed: true,
      url: '/Merchant/GetAllMerchantCategories',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      type: SearchInputTypes.date,
      field: 'createDate',
      isFixed: true,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'createdBy',
      isFixed: true,
      url: '/User/GetAllUsersDropDown', // Replaced with direct URL
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
  ];
  viewDetails = true;

  constructor(
    private router: Router,
    private service: MerchantService,
    public dialogService: DialogService,
    public toaster: ToastService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.hasPermission('merchants-all-merchants-details')) {
      this.viewDetails = false;
    }
    if (!this.authService.hasPermission('merchants-all-merchants-export')) {
      this.tableBtns.showExport = false;
    }
    if (!this.authService.hasPermission('merchants-all-merchants-block')) {
      this.actions = this.actions.filter((x) => x.name !== 'Block');
    }
    if (!this.authService.hasPermission('merchants-all-merchants-edit')) {
      this.actions = this.actions.filter((x) => x.name !== 'Edit');
    }
    if (!this.authService.hasPermission('merchants-all-merchants-add')) {
      this.tableBtns.showImport = false;
    }
    if (!this.authService.hasPermission('merchants-all-merchants-favorite')) {
      this.actions = this.actions.filter((x) => x.name !== 'Add to favorites');
    }
  }

  navigateToAdd() {
    this.router.navigate(['main/merchant/add']);
  }
  addToFavorite(row: any): any {
    let isFavorite = !row.isFavourite;
    this.service
      .Favorite({ id: row?.id, isFavorite: isFavorite })
      .subscribe((resp) => {
        if (resp.success) {
          this.reloadIfUpdated = true;
          const message = isFavorite
            ? 'Add to favorites successfully'
            : 'Removed from favorites successfully';
          this.toaster.toaster.clear();
          this.toaster.showSuccess(message);
          row.isFavourite = isFavorite;
          return row;
        }
      });
    this.reloadIfUpdated = false;
  }
  editItem(row: any): any {
    const URL = `main/merchant/edit/${row?.id}`;
    this.router.navigate([URL]);
  }

  toggleBlockItem(row: any): any {
    const isBlock = !row.isBlock;
    const action = isBlock ? 'Block' : 'Unblock';
    const okText = isBlock ? 'Yes, Block' : 'Yes, Unblock';
    // this.service
    //   .confirm(
    //     `Are you sure you want to ${action} this item?`,
    //     `${action} Item`,
    //     okText,
    //     'No,Cancel'
    //   )
    //   .subscribe((response) => {
    //     if (response) {
    this.service
      .Block({ id: row.id, isBlock })
      .pipe(takeWhile(() => this.alive))
      .subscribe((response) => {
        if (response.success) {
          const message = isBlock
            ? 'Blocked successfully'
            : 'Unblocked successfully';
          this.toaster.toaster.clear();
          this.toaster.showSuccess(message);
          row.isBlock = isBlock; // Update the row's block status
          // this.updateActions(row);
          if (row.hasOwnProperty('status')) {
            row.status = isBlock ? 'Blocked' : response.data.status;
          }
          if (row.hasOwnProperty('statusEn')) {
            row.statusEn = isBlock ? 'Blocked' : response.data.status;
          }
          // return row;
        }
      });
    // }
    // });
    // this.reloadIfUpdated = false;
  }

  goToDetails(row: any): any {
    const URL = `main/merchant/details/${row?.id}`;
    return URL;
  }

  public gridActionsList: ActionsInterface[] = [
    {
      name: 'Bulk update',
      icon: 'pi pi-chart-bar',
      permission: 'merchants-all-merchants-edit',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/Merchant/ImportToUpdate',
        header: 'Update Bulk Merchants',
        templateName: 'ImportMerchantSample.xlsx',
      },
    },
  ];
  bulkAdd(row: any): any {}
}
