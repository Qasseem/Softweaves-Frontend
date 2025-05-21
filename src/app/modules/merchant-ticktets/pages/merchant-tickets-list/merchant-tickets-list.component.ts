import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  HTTPMethods,
  MerchantTicketStatusEnum,
  SearchInputTypes,
  TicketStatusEnum,
} from 'src/app/core/shared/core/modules/table/models/enums';
import { SearchInterface } from 'src/app/core/shared/core/modules/table/models/search-interface';
import { MerchantTicketsService } from '../../services/merchant-tickets.service';
import { ToastService } from 'src/app/core/services/toaster.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { ActionsInterface } from 'src/app/core/shared/core/modules/table/models/actions.interface';
import { take, takeWhile } from 'rxjs';

@Component({
  selector: 'app-merchant-tickets-list',
  templateUrl: './merchant-tickets-list.component.html',
  styleUrls: ['./merchant-tickets-list.component.css'],
})
export class MerchantTicketsListComponent implements OnInit {
  navigateToComplete(row: any): any {
    let id = row?.ticketId;
    this.router.navigate([`main/merchanttickets/details/${id}`]);
  }

  editItem(row: any): any {
    const URL = `main/ticket/edit/${row?.ticketId}`;
    this.router.navigate([URL]);
  }
  cloneItem(row: any): any {
    const URL = `main/ticket/clone/${row?.ticketId}`;
    this.router.navigate([URL]);
  }
  blockItem(row: any): any {
    const isBlock = !row.isBlock;
    const action = isBlock ? 'Block' : 'Unblock';
    const okText = isBlock ? 'Yes, Block' : 'Yes, Unblock';
    this.service
      .Block({ id: row.ticketId, isBlock })
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response.success) {
            const message = isBlock
              ? 'Blocked successfully'
              : 'Unblocked successfully';
            this.toaster.toaster.clear();
            this.toaster.showSuccess(message);
            row.isBlock = isBlock; // Update the row's block status
            if (row.hasOwnProperty('status')) {
              row.status = isBlock ? 'Blocked' : response.data.status;
            }
            if (row.hasOwnProperty('statusEn')) {
              row.statusEn = isBlock ? 'Blocked' : response.data.status;
            }
          }
        },
      });

    this.reloadIfUpdated = false;
  }

  goToDetails(row: any): any {
    const id = row.tickedId;
    const URL = `/main/merchanttickets/details/${id}`;
    return URL;
  }

  public tableBtns: TableButtonsExistanceInterface = {
    showAllButtons: true,
    showAdd: false,
    showExport: true,
    showFilter: true,
  };
  public columns: ColumnsInterface[] = [
    {
      field: 'ticketId',
      header: 'Ticket ID',
    },
    {
      field: 'merchantNumber',
      header: 'Merchant ID',
    },
    {
      field: [
        { label: 'merchantEn', custom: 'navigator' },
        { label: 'merchantAr', custom: 'default' },
      ],
      header: 'Merchant Name',
      link: '/main/merchant/details/',
      customCell: 'multiLabel',
      action: (row) => this.goToDetails(row),
    },
    {
      field: 'terminalId',
      header: 'Terminal ID',
    },
    {
      field: 'createdDate',
      header: 'Created At',
      customCell: 'date',
    },
    {
      field: [
        { label: 'categoryNameEn', custom: 'default' },
        { label: 'categoryNameAr', custom: 'default' },
      ],
      header: 'Category',
      customCell: 'multiLabel',
    },
    {
      field: [
        { label: 'errandTypeEn', custom: 'default' },
        { label: 'errandTypeAr', custom: 'default' },
      ],
      header: 'Errand Type',
      customCell: 'multiLabel',
    },

    {
      field: [
        { label: 'cityEn', custom: 'default' },
        { label: 'zoneEn', custom: 'default' },
      ],
      header: 'City & Zone',
      customCell: 'multiLabel',
    },
    {
      field: 'statusEn',
      header: 'Status',
      // customCell: 'multiLabel',
    },
  ];

  public actions: ActionsInterface[] = [
    {
      name: 'Review Ticket',
      icon: 'pi pi-list-check',
      customPermission: (row: any) =>
        row.statusId == MerchantTicketStatusEnum.New ||
        row.statusId == MerchantTicketStatusEnum.NotRegistered,
      permission: 'review',
      call: (row: any) => this.navigateToComplete(row),
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
      field: 'ticketId',
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
      type: SearchInputTypes.select,
      field: 'status',
      isFixed: true,
      url: '/Ticket/GetAllTicketStatus',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'category',
      isFixed: true,
      url: '/Ticket/GetTicketCategory',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },

    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'updatedBy',
      isFixed: true,
      url: '/User/GetAllUsersDropDown',
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
  ];
  viewDetails = true;
  reloadIfUpdated = false;
  weekDays: any[];
  constructor(
    private router: Router,
    private service: MerchantTicketsService,
    public toaster: ToastService,
    public authService: AuthService
  ) {}
  recurrenceTypes = [];

  ngOnInit() {
    if (!this.authService.hasPermission('tickets-merchant-tickets-details')) {
      this.viewDetails = false;
    }
    if (!this.authService.hasPermission('tickets-merchant-tickets-export')) {
      this.tableBtns.showExport = false;
    }
    if (!this.authService.hasPermission('tickets-merchant-tickets-block')) {
      this.actions = this.actions.filter((x) => x.name !== 'Block');
    }
    if (!this.authService.hasPermission('tickets-merchant-tickets-edit')) {
      this.actions = this.actions.filter((x) => x.name !== 'Edit');
    }
    if (!this.authService.hasPermission('tickets-merchant-tickets-add')) {
      this.tableBtns.showImportCancellation = false;
      this.tableBtns.showImportVisit = false;
      this.tableBtns.showChangeStatus = false;
    }
  }
  ngOnDestroy(): void {}
  navigateToAdd() {
    this.router.navigate(['main/ticket/add']);
  }

  navigateToHistory(row) {
    let id = row?.ticketId;
    this.router.navigate([`main/ticket/history/${id}/${'Tickets'}`]);
  }
}
