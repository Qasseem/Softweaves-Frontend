import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionsInterface } from 'src/app/core/shared/core/modules/table/models/actions.interface';
import {
  HTTPMethods,
  SearchInputTypes,
} from 'src/app/core/shared/core/modules/table/models/enums';
import { SearchInterface } from 'src/app/core/shared/core/modules/table/models/search-interface';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { ReportsService } from '../../services/reports.service';
import { ToastService } from 'src/app/core/services/toaster.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-replacement-report',
  templateUrl: './replacement-report.component.html',
  styleUrls: ['./replacement-report.component.css'],
})
export class ReplacementReportComponent implements OnInit {
  public tableBtns: TableButtonsExistanceInterface = {
    showAllButtons: true,
    showAdd: false,
    showExport: true,
    showFilter: true,
  };
  public columns: ColumnsInterface[] = [
    {
      field: 'id',
      header: 'ID',
    },
    {
      field: 'mid',
      header: 'MID',
    },
    {
      field: 'tid',
      header: 'TID',
    },
    {
      field: 'merchantName',
      header: 'Merchant Name',
    },

    {
      field: [
        { label: 'takenBy', custom: 'normal' },
        { label: 'actionDate', custom: 'defaultDate' },
      ],
      header: 'Action By & At',
      customCell: 'multiLabel',
      width: '100px',
    },
    {
      field: 'teamName',
      header: 'Team',
    },
  ];

  public actions: ActionsInterface[] = [];

  filters: SearchInterface[] = [
    {
      type: SearchInputTypes.date,
      field: 'actionDate',
      isFixed: true,
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
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'actionBy',
      isFixed: true,
      url: '/User/GetAllUsersDropDown',
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
      field: 'oldMID',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'oldTID',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'oldMerchantName',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'mid',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'tid',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'merchantName',
      isFixed: true,
    },
    {
      type: SearchInputTypes.text,
      field: 'trx_ID',
      isFixed: true,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'condition',
      isFixed: true,
      url: '/Device/GetConditionDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
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
      field: 'currency',
      isFixed: true,
      url: '/Device/GetCurrencyDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'paymentMethod',
      isFixed: true,
      url: '/Device/GetPaymentMethodDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
    },
    {
      isMultiple: false,
      type: SearchInputTypes.selectValue,
      field: 'cancellationFee',
      ddlData: [
        { nameEn: '+0', id: true },
        { nameEn: '0', id: false },
      ],
      isFixed: true,
    },
    {
      isMultiple: false,
      type: SearchInputTypes.selectValue,
      field: 'replacementReceiptSigned',
      ddlData: [
        { nameEn: 'Yes', id: true },
        { nameEn: 'No', id: false },
      ],
      isFixed: true,
    },

    {
      isMultiple: false,
      type: SearchInputTypes.selectValue,
      field: 'goodToGo',
      ddlData: [
        { nameEn: 'Yes', id: true },
        { nameEn: 'No', id: false },
      ],
      isFixed: true,
    },
    {
      isMultiple: false,
      type: SearchInputTypes.selectValue,
      field: 'needRecycling',
      ddlData: [
        { nameEn: 'Yes', id: true },
        { nameEn: 'No', id: false },
      ],
      isFixed: true,
    },
    {
      isMultiple: false,
      type: SearchInputTypes.selectValue,
      field: 'needRepair',
      ddlData: [
        { nameEn: 'Yes', id: true },
        { nameEn: 'No', id: false },
      ],
      isFixed: true,
    },
    {
      isMultiple: false,
      type: SearchInputTypes.selectValue,
      field: 'needBranding',
      ddlData: [
        { nameEn: 'Yes', id: true },
        { nameEn: 'No', id: false },
      ],
      isFixed: true,
    },
  ];
  viewDetails = true;
  reloadIfUpdated = false;
  weekDays: any[];
  constructor(
    private router: Router,
    private service: ReportsService,
    public toaster: ToastService,
    public authService: AuthService
  ) {}
  recurrenceTypes = [];

  ngOnInit() {
    if (!this.authService.hasPermission('reports-replacement-report-export')) {
      this.tableBtns.showExport = false;
    }
  }
  ngOnDestroy(): void {}
  navigateToAdd() {
    this.router.navigate(['main/ticket/add']);
  }
}
