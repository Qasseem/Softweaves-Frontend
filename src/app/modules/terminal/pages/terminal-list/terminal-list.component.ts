import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { TerminalService } from '../../services/terminal.service';
import { first, shareReplay, take, takeWhile } from 'rxjs';
import { ToastService } from 'src/app/core/services/toaster.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'oc-terminal-list',
  templateUrl: './terminal-list.component.html',
  styleUrls: ['./terminal-list.component.scss'],
})
export class TerminalListComponent implements OnInit, OnDestroy {
  alive = true;
  reloadIfUpdated = false;
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
          this.toaster.showSuccess(message);
          row.isFavourite = isFavorite;
          return row;
        }
      });
    this.reloadIfUpdated = false;
  }

  editItem(row: any): any {
    const URL = `main/terminal/edit/${row?.id}`;
    this.router.navigate([URL]);
  }
  blockItem(row: any): any {
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
      .pipe(
        takeWhile(() => this.alive),
        first()
      )
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
    //     }
    //   });
    // this.reloadIfUpdated = false;
  }

  goToDetails(row: any): any {
    const id = row.id;
    const URL = `main/merchant/details/${row?.id}`;
    return URL;
  }

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
    {
      name: 'Block',
      icon: 'pi pi-ban',
      call: (row: any) => this.blockItem(row),
    },
    {
      name: 'Add to favorites',
      icon: 'pi pi-heart',
      call: (row: any) => this.addToFavorite(row),
    },
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
      type: SearchInputTypes.choice,
      field: 'merchant',
      isFixed: true,
      url: '/Terminal/GetAllMechantDropDown',
      isMultiple: true,
      serverSide: true,
      method: HTTPMethods.postReq,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.choice,
      field: 'userName',
      isFixed: true,
      serverSide: true,
      url: '/Terminal/GetAllMechantUserNamesDropDown', // Replaced with direct URL
      method: HTTPMethods.postReq,
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
      url: '/Terminal/GetAllPOSTypes', // Replaced with direct URL
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'errandChannel',
      isFixed: true,
      url: '/Terminal/GetAllErrandChannels', // Replaced with direct URL
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: false,
      type: SearchInputTypes.select,
      field: 'region',
      isFixed: true,
      url: '/Terminal/GetAllRegions', // Replaced with direct URL
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: false,
      type: SearchInputTypes.select,
      field: 'city',
      isFixed: true,
      url: '/Terminal/GetAllCities', // Replaced with direct URL
      method: HTTPMethods.getReq,
      propValueName: 'id',
      header: '0',
    },

    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'zone',
      isFixed: true,
      url: '/Terminal/GetAllZones', // Replaced with direct URL
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
    public service: TerminalService,
    public toaster: ToastService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.hasPermission('terminals-all-terminals-details')) {
      this.viewDetails = false;
    }
    if (!this.authService.hasPermission('terminals-all-terminals-export')) {
      this.tableBtns.showExport = false;
    }
    if (!this.authService.hasPermission('terminals-all-terminals-block')) {
      this.actions = this.actions.filter((x) => x.name !== 'Block');
    }
    if (!this.authService.hasPermission('terminals-all-terminals-edit')) {
      this.actions = this.actions.filter((x) => x.name !== 'Edit');
    }

    if (!this.authService.hasPermission('terminals-all-terminals-favorite')) {
      this.actions = this.actions.filter((x) => x.name !== 'Add to favorites');
    }
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  navigateToAdd() {
    this.router.navigate(['main/terminal/add']);
  }
  public gridActionsList: ActionsInterface[] = [
    {
      name: 'Bulk update',
      icon: 'pi pi-chart-bar',
      permission: 'terminals-all-terminals-edit',
      call: (row: any) => this.bulkAdd(row),
      type: ActionsTypeEnum.File,
      uploadFileData: {
        url: '/Merchant/ImportToUpdate',
        header: 'Update Bulk Terminals',
        templateName: 'Import Update Device.xlsx',
      },
    },
  ];
  bulkAdd(row: any): any {}
}
