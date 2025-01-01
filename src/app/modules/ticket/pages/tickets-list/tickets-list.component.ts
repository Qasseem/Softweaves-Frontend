import { Component, OnDestroy, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { Router } from '@angular/router';
import { ActionsInterface } from 'src/app/core/shared/core/modules/table/models/actions.interface';
import {
  SearchInputTypes,
  HTTPMethods,
  TicketStatusEnum,
} from 'src/app/core/shared/core/modules/table/models/enums';
import { SearchInterface } from 'src/app/core/shared/core/modules/table/models/search-interface';
import { TableButtonsExistanceInterface } from 'src/app/core/shared/core/modules/table/models/table-url.interface';
import { ColumnsInterface } from 'src/app/core/shared/models/Interfaces';
import { Observable, of, startWith, takeWhile } from 'rxjs';
import { ToastService } from 'src/app/core/services/toaster.service';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ScheduleTicketsService } from '../../services/schedule-tickets.service';

export function dayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined) {
      return null; // Don't validate if there's no value
    }

    if (value >= 1 && value <= 30) {
      return null; // Valid value
    } else {
      return { dayInvalid: true }; // Invalid value
    }
  };
}
export function recurrenceValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const recurrenceType = control.parent?.get('recurrenceTypeId')?.value;
    const recurrenceValue = control.value;

    let maxLimit: number;

    switch (recurrenceType) {
      case 3:
        maxLimit = 7;
        break;
      case 2:
        maxLimit = 4;
        break;
      case 1:
        maxLimit = 12;
        break;
    }

    const minLimit = 1;

    if (recurrenceValue < minLimit || recurrenceValue > maxLimit) {
      return of({
        recurrenceError: `Recurrence must be between ${minLimit} and ${maxLimit} ${
          recurrenceType == 1
            ? 'months'
            : recurrenceType == 2
            ? 'weeks'
            : 'days'
        }.`,
      });
    }

    return of(null);
  };
}
export function checkDates(
  startDateField: string,
  endDateField: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get(startDateField)?.value;
    const endDate = control.get(endDateField)?.value;

    if (!startDate || !endDate) {
      return null; // If either date is not present, do not validate
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return { endDateBeforeStartDate: true }; // Invalid: End date is before or same as start date
    }

    return null; // Valid: End date is after start date
  };
}
@Component({
  selector: 'oc-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss'],
})
export class TicketsListComponent implements OnInit, OnDestroy {
  navigateToComplete(row: any): any {
    let id = row?.ticketId;
    this.router.navigate([`main/ticket/complete/${id}`]);
  }
  alive = true;
  scheduleForm: FormGroup;
  scheduleDialogVisible = false;
  selectedScheduleRow: any;

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
      .Block({ id: row.ticketId, isBlock })
      .pipe(takeWhile(() => this.alive))
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
            // this.updateActions(row);
            // this.reloadIfUpdated = true;
          }
        },
      });
    //   }
    // });
    this.reloadIfUpdated = false;
  }
  updateActions(row: any) {
    // this.actions = this.actions.map((actionItem) => {
    //   if (actionItem.name === 'Block' && row.isBlocked) {
    //     return {
    //       ...actionItem,
    //       name: 'Unblock',
    //       icon: 'pi pi-check',
    //       call: (r: any) => this.blockItem(r),
    //     };
    //   } else if (actionItem.name === 'Unblock' && !row.isBlocked) {
    //     return {
    //       ...actionItem,
    //       name: 'Block',
    //       icon: 'pi pi-ban',
    //       call: (r: any) => this.blockItem(r),
    //     };
    //   }
    //   return actionItem;
    // });
  }
  goToDetails(row: any): any {
    const id = row.tickedId;
    const URL = `/main/ticket/details/${id}`;
    return URL;
  }

  public tableBtns: TableButtonsExistanceInterface = {
    showAllButtons: true,
    showAdd: true,
    showExport: true,
    showFilter: true,
    showImport: false,
    showImportVisit: true,
    showImportCancellation: true,
    showChangeStatus: true,
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
      field: 'assignee',
      header: 'Assignee',
    },
    {
      field: 'statusEn',
      header: 'Status',
      // customCell: 'multiLabel',
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
      name: 'Clone',
      icon: 'pi pi-clone',
      call: (row: any) => this.cloneItem(row),
    },
    {
      name: 'Schedule',
      icon: 'pi pi-calendar',
      call: (row: any) => this.showSchedule(row),
    },
    {
      name: 'History',
      icon: 'pi pi-history',
      call: (row: any) => this.navigateToHistory(row),
    },
    {
      name: 'Complete',
      icon: 'pi pi-list-check',
      customPermission: (row: any) =>
        row.statusId == TicketStatusEnum.InProgress ||
        row.statusId == TicketStatusEnum.AgentOnWay ||
        row.statusId == TicketStatusEnum.Assigned,
      permission: 'complete',
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
      isMultiple: false,
      type: SearchInputTypes.selectValue,
      field: 'overdue',
      ddlData: [
        { nameEn: 'Yes', id: true },
        { nameEn: 'No', id: false },
      ],
      isFixed: true,
    },
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'assignee',
      isFixed: true,
      url: '/User/GetAllUsersDropDown',
      method: HTTPMethods.getReq,
      propValueName: 'id',
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
    {
      isMultiple: true,
      type: SearchInputTypes.select,
      field: 'feedback',
      isFixed: true,
      url: '/Ticket/GetAllFeedbacks',
      method: HTTPMethods.getReq,
      propValueName: 'id',
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
  reloadIfUpdated = false;
  weekDays: any[];
  constructor(
    private router: Router,
    private service: TicketService,
    public toaster: ToastService,
    public authService: AuthService,
    private schedule: ScheduleTicketsService,
    private fb: FormBuilder
  ) {
    this.scheduleForm = this.fb.group(
      {
        ticketId: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        repeatCount: [
          '',
          {
            validators: [Validators.required],
            asyncValidators: [recurrenceValidator()],
            updateOn: 'blur', // You can set this to 'change' if you want validation to happen immediately.
          },
        ],
        recurrenceTypeId: [1, [Validators.required]],
        dayOfWeekId: [null],
        day: [
          '1',
          {
            validators: [], // Start with no validators
            updateOn: 'change', // Trigger validation on blur
          },
        ],
      },
      { validators: checkDates('startDate', 'endDate') }
    );
  }
  recurrenceTypes = [];

  ngOnInit() {
    if (!this.authService.hasPermission('tickets-all-tickets-details')) {
      this.viewDetails = false;
    }
    if (!this.authService.hasPermission('tickets-all-tickets-export')) {
      this.tableBtns.showExport = false;
    }
    if (!this.authService.hasPermission('tickets-all-tickets-block')) {
      this.actions = this.actions.filter((x) => x.name !== 'Block');
    }
    if (!this.authService.hasPermission('tickets-all-tickets-edit')) {
      this.actions = this.actions.filter((x) => x.name !== 'Edit');
    }
    if (!this.authService.hasPermission('tickets-all-tickets-add')) {
      this.tableBtns.showImportCancellation = false;
      this.tableBtns.showImportVisit = false;
      this.tableBtns.showChangeStatus = false;
    }
    if (!this.authService.hasPermission('tickets-all-tickets-favorite')) {
      this.actions = this.actions.filter((x) => x.name !== 'Add to favorites');
    }
    this.scheduleForm
      .get('recurrenceTypeId')
      .valueChanges.pipe(startWith(1))
      .subscribe((val) => {
        this.scheduleForm.get('repeatCount').updateValueAndValidity();
        if (val == 3) {
          this.scheduleForm.get('day').clearValidators();
          this.scheduleForm.get('day').updateValueAndValidity();
          this.scheduleForm.get('dayOfWeekId').clearValidators();
          this.scheduleForm.get('dayOfWeekId').updateValueAndValidity();
        } else if (val == 2) {
          this.scheduleForm.get('day').clearValidators();
          this.scheduleForm.get('day').updateValueAndValidity();
          this.scheduleForm
            .get('dayOfWeekId')
            .addValidators([Validators.required]);
          this.scheduleForm.get('dayOfWeekId').updateValueAndValidity();
        } else if (val == 1) {
          this.scheduleForm
            .get('day')
            .addValidators([Validators.required, dayValidator()]);
          this.scheduleForm.get('day').updateValueAndValidity();
          this.scheduleForm.get('dayOfWeekId').clearValidators();
          this.scheduleForm.get('dayOfWeekId').updateValueAndValidity();
        }
      });
    this.schedule.getScheduleRecurrenceType().subscribe({
      next: (res) => {
        this.recurrenceTypes = res.data;
      },
    });
    this.schedule.getScheduleWeekDays().subscribe({
      next: (res) => {
        this.weekDays = res.data;
      },
    });
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  navigateToAdd() {
    this.router.navigate(['main/ticket/add']);
  }
  showSchedule(row) {
    this.scheduleDialogVisible = true;
    this.selectedScheduleRow = row;
    this.scheduleForm.get('ticketId').patchValue(row.ticketId);
  }
  submitDialog(row) {
    const formValue = this.scheduleForm.value;
    if (formValue.recurrenceTypeId == 2 || formValue.recurrenceTypeId == 3) {
      formValue.day = null;
    }
    if (this.scheduleForm.valid) {
      this.service.schedule(this.scheduleForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            this.scheduleDialogVisible = false;
            const message = 'Ticket Schedule Created Successfully';
            this.toaster.showSuccess(message);
          }
        },
      });
    } else {
      this.scheduleForm.errors;
      this.scheduleForm.markAllAsTouched();
    }
  }
  navigateToHistory(row) {
    let id = row?.ticketId;
    this.router.navigate([`main/ticket/history/${id}/${'Tickets'}`]);
  }
}
