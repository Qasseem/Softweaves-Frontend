import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toaster.service';
import { ActionsInterface } from 'src/app/core/shared/core/modules/table/models/actions.interface';
import {
  HTTPMethods,
  SearchInputTypes,
} from 'src/app/core/shared/core/modules/table/models/enums';
import { SearchInterface } from 'src/app/core/shared/core/modules/table/models/search-interface';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { TerminalService } from '../../services/terminal.service';

@Component({
  selector: 'oc-terminal-favorite-list',
  templateUrl: './terminal-favorite-list.component.html',
  styleUrl: './terminal-favorite-list.component.scss',
})
export class TerminalFavoriteListComponent implements OnInit, OnDestroy {
  reloadIfUpdated = false;
  alive = false;

  public tableBtns: TableButtonsExistanceInterface = {
    showAllButtons: true,
    showAdd: true,
    showExport: false,
    showFilter: true,
    showImport: false,
  };
  public columns: ColumnsInterface[] = [
    {
      field: 'reference',
      header: 'Ref',
    },
    {
      field: 'terminalId',
      header: 'Terminal Id',
    },
    {
      field: 'merchantNumber',
      header: 'Merchant Id',
    },
    {
      field: [
        { label: 'merchantNameEN', custom: 'navigator' },
        { label: 'merchantNameAR', custom: 'default' },
      ],
      header: 'Merchant Name',
      customCell: 'multiLabel',
      link: '/main/merchant/details/',
      action: (row) => this.goToDetails(row),
    },
    {
      field: 'phoneNumber',
      header: 'Phone Number',
    },
    {
      field: 'city',
      header: 'City',
    },
    {
      field: 'posType',
      header: 'POS Type',
    },
    {
      field: 'errandChannel',
      header: 'Errand Channel',
    },
    {
      field: [
        { label: 'createdBy', custom: 'default' },
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
      call: (row: any) => this.editItem(row),
      // customPermission: (row: any) => row.id > 3,
    },
    // {
    //   name: 'Block',
    //   icon: 'pi pi-ban',
    //   call: (row: any) => this.blockItem(row),
    // },
    // {
    //   name: 'Remove from favorites',
    //   icon: 'pi pi-heart-fill',
    //   call: (row: any) => this.removeFromFavorite(row),
    // },
  ];

  filters: SearchInterface[] = [
    {
      type: SearchInputTypes.date,
      field: 'createDate',
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
      field: 'merchant',
      isFixed: true,
      url: '/Terminal/GetAllMerchantDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
      filter: true,
      filterBy: 'merchantNumber,name',
    },

    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'users',
      isFixed: true,
      url: '/Users/GetAllUsersDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      type: SearchInputTypes.text,
      field: 'phone',
      isFixed: true,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'posType',
      isFixed: true,
      url: '/Terminal/GetAllPOSTypes',
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
      field: 'address',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'landmark',
      isFixed: true,
    },
  ];
  viewDetails = true;
  constructor(
    private router: Router,
    public service: TerminalService,
    public authService: AuthService,
    private toaster: ToastService
  ) {}
  showFavourite = false;
  ngOnInit(): void {
    if (!this.authService.hasPermission('terminals-all-terminals-details')) {
      this.viewDetails = false;
    }
    if (!this.authService.hasPermission('terminals-all-terminals-export')) {
      this.tableBtns.showExport = false;
    }
    if (!this.authService.hasPermission('terminals-all-terminals-favorite')) {
      this.showFavourite = false;
    }
  }
  editItem(row: any): any {
    const URL = `main/terminal/edit/${row?.id}`;
    this.router.navigate([URL]);
  }
  removeFromFavorite(row: any): any {
    let isFavorite = !row.isFavourite;
    this.service
      .Favorite({ id: row?.id, isFavorite: isFavorite })
      .subscribe((resp) => {
        if (resp.success) {
          this.reloadIfUpdated = true;
          const message = isFavorite
            ? 'Add to favorites successfully'
            : 'Removed from favorites successfully';
          this.toaster.showSuccess(message);
          row.isFavourite = isFavorite;
          return row;
        }
      });
    this.reloadIfUpdated = false;
  }
  blockItem(row: any): any {
    const isBlock = !row.isBlock;
    const action = isBlock ? 'Block' : 'Unblock';
    const okText = isBlock ? 'Yes, Block' : 'Yes, Unblock';
    this.service;
    // .confirm(
    //   `Are you sure you want to ${action} this item?`,
    //   `${action} Item`,
    //   okText,
    //   'No,Cancel'
    // )
    // .subscribe((response) => {
    //   if (response) {
    this.service
      .Block({ id: row.id, isBlock })
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        if (res.success) {
          const message = isBlock
            ? 'Blocked successfully'
            : 'Unblocked successfully';
          this.toaster.toaster.clear();
          this.toaster.showSuccess(message);
          row.isBlock = isBlock; // Update the row's block status
          // this.updateActions(row);
          this.reloadIfUpdated = true;
          return row;
        }
      });
    //     }
    //   });
    // this.reloadIfUpdated = false;
  }
  goToDetails(row: any): any {
    const id = row.id;
    const URL = `main/merchant/details/${row?.id}`;
    return URL;
  }
  navigateToAdd() {
    this.router.navigate(['main/terminal/add']);
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
}
