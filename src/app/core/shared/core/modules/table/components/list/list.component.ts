import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  OnDestroy,
  OnChanges,
  Output,
} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import {
  take,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  finalize,
  map,
  takeWhile,
} from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormArray,
} from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TableUrlInterface } from '../../models/table-url.interface';
import { ColumnsInterface } from '../../models/columns.interface';
import {
  ActionsInterface,
  ViewCustomPermission,
} from '../../models/actions.interface';
import { TableOptionsInterface } from '../../models/options.interface';
import { AppTranslateService } from 'src/app/core/shared/services/translate.service';
import { TableCoreService } from '../../services/table-core.service';
import { ToastService } from 'src/app/core/services/toaster.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'oc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('deleteSwal', { static: false }) deleteSwal: any;

  @Input() data: any[];
  @Input() selectedData: any[];
  @Input() url: TableUrlInterface;
  @Input() columnsI: ColumnsInterface[];
  @Input() actions: ActionsInterface[];
  @Input() id = 'id';
  @Input() options: TableOptionsInterface;
  @Input() clientSide: boolean;
  @Input() first = 0;
  @Input() noDataText = '';
  @Input() viewCustomPermission: ViewCustomPermission;
  @Input() service: any;
  @Input() modulePageName = '';
  @Output() rowClickedAction = new EventEmitter();
  alive = true;

  displayBasic = false;
  displayBasicDelete = false;
  @Output() selected: EventEmitter<any[]> = new EventEmitter<any[]>();
  apis;
  selectedColumns = [] as ColumnsInterface[];
  filteredArray: string[] = [];
  listForm: UntypedFormGroup;
  columnFormArray: UntypedFormArray;
  notes: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private firstInit: boolean; // To trigger the first time data load
  navigateTo: any;
  moduleName: any;
  constAction: any;
  customPermission: boolean[];
  itemRow: any;
  deletedItem: any = {};
  activatedRoute: string;
  fullRoute: string[];

  listActions = [];
  rowData;
  totalRecords: number = 0;
  currentPage: number = 0;
  rows: number = 10;
  setRow(rowData) {
    this.rowData = rowData;
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public lang: AppTranslateService,
    public tableCore: TableCoreService,
    private translateService: TranslateService,
    private toaster: ToastService,
    private confirmationService: ConfirmationService
  ) {}
  navToFilter() {
    this.tableCore.filterClick$.next(true);
  }
  reset() {
    this.first = 0;
  }

  callAction(name) {
    let action = this.actions.find((x) => x.name == name);
    if (action) {
      if (action?.name == 'Block' || action?.name == 'Unblock') {
        this.ShowBlockDialog(this.rowData);
      } else {
        action.call(this.rowData);
      }
    }
  }
  filterArrayByValue(array: any, valuesToMatch: string[], key: string): any {
    return array.filter((item) => !valuesToMatch.includes(item[key]));
  }
  onShow(event, rowData, listActions, actions) {
    if (rowData.ticketId && rowData.statusEn == 'Completed') {
      listActions = this.filterArrayByValue(
        listActions,
        ['Block', 'Unblock', 'Edit'],
        'label'
      );

      actions = this.filterArrayByValue(
        actions,
        ['Block', 'Unblock', 'Edit'],
        'name'
      );
    }
    actions = actions.map((actionItem) => {
      // console.log(actionItem,rowData);
      if (actionItem.name === 'Block' && rowData.isBlock) {
        return {
          ...actionItem,
          name: 'Unblock',
          icon: 'pi pi-check',
        };
      } else if (actionItem.name === 'Unblock' && !rowData.isBlock) {
        return {
          ...actionItem,
          name: 'Block',
          icon: 'pi pi-ban',
        };
      }
      if (actionItem.name === 'Add to favorites' && rowData.isFavourite) {
        return {
          ...actionItem,
          name: 'Remove from favorites',
          icon: 'pi pi-heart-fill',
        };
      } else if (
        actionItem.name === 'Remove from favorites' &&
        !rowData.isFavourite
      ) {
        return {
          ...actionItem,
          name: 'Add to favorites',
          icon: 'pi pi-heart',
        };
      }

      return actionItem;
    });
    this.actions = [...this.actions];
    listActions = listActions.map((actionItem) => {
      // console.log(actionItem,rowData);
      if (actionItem.label === 'Block' && rowData.isBlock) {
        return {
          ...actionItem,
          label: 'Unblock',
          icon: 'pi pi-check',
        };
      } else if (actionItem.label === 'Unblock' && !rowData.isBlock) {
        return {
          ...actionItem,
          label: 'Block',
          icon: 'pi pi-ban',
        };
      }
      if (actionItem.label === 'Add to favorites' && rowData.isFavourite) {
        return {
          ...actionItem,
          label: 'Remove from favorites',
          icon: 'pi pi-heart-fill',
        };
      } else if (
        actionItem.label === 'Remove from favorites' &&
        !rowData.isFavourite
      ) {
        return {
          ...actionItem,
          label: 'Add to favorites',
          icon: 'pi pi-heart',
        };
      }

      return actionItem;
    });

    this.listActions = listActions;
    // console.log(listActions)
  }
  validateActionsForRow(rowData) {
    this.listActions = [];
    this.actions.forEach((element) => {
      if (
        element.customPermission == undefined ||
        element.customPermission(rowData)
      ) {
        this.listActions.push({
          label: element.name,
          icon: element.icon,
          command: () => {
            this.callAction(element?.name);
          },
        });
      }
    });
  }
  ngOnInit() {
    this.listActions = [];
    this.actions?.forEach((element) => {
      this.listActions.push({
        label: element.name,
        command: () => {
          this.callAction(element?.name);
        },
      });
    });

    this.fullRoute = this.router.url?.split('/');
    this.activatedRoute =
      '/' + this.fullRoute[1] + '/' + this.fullRoute[2] + '/details/';
    this.navigateTo = this.route.snapshot.data.navigateTo;
    this.moduleName = this.route.snapshot.data.moduleName;

    this.columnsI.map((col) => {
      this.translateService
        .get(col.header)
        .pipe(take(1))
        .subscribe((translation) => {
          col.header = translation;
        });
    });

    this.selectedColumns = this.columnsI;
    this.updateSelectedColumnsAPI();

    this.getDataFromService();
    this.columnSearchInput();

    this.buildEditableForm();

    this.options = {
      add: true,
      search: false,
      reorder: false,
      loading: false,
      details: true,
      history: true,
      check: false,
      blockNote: true,
      columnSearch: true,
      editable: false,
      historyDetails: false,
      viewDetails: true,
      viewDetailsURL: null,
      export: true,
      block: false,
      favourite: false,
      edit: false,
      editURL: null,
      clone: false,
      ...this.options,
    };
    this.checkConstAction(this.actions);
    this.filterDate();
  }

  ngOnChanges() {
    if (this.data && this.clientSide)
      this.tableCore.pageOptions.count = this.data.length;
  }

  ngOnDestroy() {
    this.tableCore.searchNew$.next({});
    this.tableCore.search = '';
    this.tableCore.pageOptions = {
      count: -1,
      offset: 0,
      limit: 10,
      searchKey: '',
      isSearchFilter: false,
    };
    this.firstInit = false;
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  collectNotes(note) {
    this.notes = note;
  }

  /**
   * Get the Table Data from the Service
   * @memberof TableComponent
   */
  getTableData(): void {
    if (this.url && this.url.getAll && !this.url.refScope && !this.url.refId) {
      const params = { refId: this.route.snapshot.params.id };
      this.tableCore
        .getAllData(this.url.getAll, params)
        .pipe(
          take(1),
          map(() => (this.data = this.tableCore.tableData)),
          finalize(() => (this.firstInit = true))
        )
        .subscribe();
    } else if (
      this.url &&
      this.url.getAll &&
      this.url.refScope &&
      this.url.refId
    ) {
      switch (this.url.refScope) {
        case 'merchantId': {
          const merchantParams = { merchantId: parseInt(this.url.refId) };
          this.tableCore
            .getAllData(this.url.getAll, merchantParams)
            .pipe(
              take(1),
              map(() => {
                this.data = this.tableCore.tableData;
              }),
              finalize(() => (this.firstInit = true))
            )
            .subscribe();
          break;
        }
        case 'terminalId': {
          const terminalParams = { terminalId: parseInt(this.url.refId) };
          this.tableCore
            .getAllData(this.url.getAll, terminalParams)
            .pipe(
              take(1),
              map(() => {
                this.data = this.tableCore.tableData;
              }),
              finalize(() => (this.firstInit = true))
            )
            .subscribe();
          break;
        }
        default: {
          const params = { id: parseInt(this.url.refId) };
          this.tableCore
            .getAllData(this.url.getAll, params)
            .pipe(
              take(1),
              map(() => {
                this.data = this.tableCore.tableData;
              }),
              finalize(() => (this.firstInit = true))
            )
            .subscribe();
          break;
        }
      }
    }
  }
  checkConstAction(actions) {
    if (typeof actions === 'boolean' && actions == false) {
      return;
    }
    this.constAction = actions?.some(
      (v) => v.isDelete || v.isBlock || v.isEdit
    );
  }

  getDataFromService() {
    if (!this.clientSide) this.getTableData();
  }

  /**
   * Toggle Block, Unblock permission string
   *
   * @param {*} row - Table Row
   * @returns {string} - Permission String
   * @memberof ListComponent
   */
  getBlockPermission(row: any): string {
    if (!this.url.unblock) return 'block';
    return row.isBlock ? 'unblock' : 'block';
  }

  buildEditableForm() {
    if (!this.options.editable) return;
    // const newFilArray = this.columnsI.map(col => {
    //   if (!col.editable) return;
    //   return { [col.field]: ['', col.form.validation] };
    // });
    this.columnFormArray = this.fb.array([]);
  }

  createRowFormArray() {
    return this.fb.group({});
  }

  /**
   * Navigate to Details Page
   * @param {number} id - Item ID
   * @returns {Promise<boolean>}
   * @memberof TableComponent
   */
  goToDetailsPage(id: string): Promise<boolean> {
    return this.router.navigate(['../details', id], {
      relativeTo: this.route.parent,
    });
  }

  viewHistory(row) {
    this.router.navigate([this.navigateTo, row.id], {
      relativeTo: this.route.parent,
      queryParams: {
        moduleName: this.moduleName,
        relativeTo: this.route.parent,
        row: JSON.stringify(row),
      },
    });
  }

  /**
   * Navigate to Edit Page
   * @param {number} id - Item ID
   * @returns {Promise<boolean>}
   * @memberof TableComponent
   */
  goToEditPage(id: string): Promise<boolean> {
    return this.router.navigate(['../edit', id], {
      relativeTo: this.route.parent,
    });
  }

  /**
   * Navigate to Deleted History Page
   * @returns {Promise<boolean>}
   * @memberof TableComponent
   */
  goToDeletedHistoryPage(): Promise<boolean> {
    return this.router.navigate(['../deletedhistory'], {
      relativeTo: this.route.parent,
    });
  }

  /**
   * Create Array of strings from selected columns
   * @memberof ListComponent
   */
  updateSelectedColumnsAPI(): void {
    this.filteredArray = [];
    this.selectedColumns.map((col) => this.filteredArray.push(col.field));
    // console.log(this.selectedColumns);
  }

  /**
   * Delete a Single Item from the Table
   * @param {string} id - Item ID
   * @memberof TableComponent
   */
  async delete() {
    if (!this.url.delete) return;
    // const swalConfirm = await this.deleteConfirm.fire();
    // if (swalConfirm.value)
    this.tableCore
      .deleteItem(this.url.delete, this.deletedItem.id)
      .pipe(
        take(1),
        finalize(() => this.getTableData())
      )
      .subscribe();
    this.displayBasicDelete = !this.displayBasicDelete;
  }

  export(): void {
    if (this.url.export)
      this.tableCore.exportTable(this.url.export).subscribe();
  }
  exportDetails(): void {
    if (this.url.exportDetails)
      this.tableCore.exportTable(this.url.exportDetails).subscribe();
  }
  exportClientData() {
    const data = this.data.map((item) =>
      this.selectedColumns.reduce(
        (old, crr) => ({ ...old, [crr.header]: item[crr.field] }),
        {}
      )
    );

    const fileName = 'Report';
    const exportType = 'xls';

    // exportFromJSON({ data, fileName, exportType });
  }
  /**
   * Show the block alert
   *
   * @param {*} [item] The item row data
   * @memberof ListComponent
   */
  showBlockModal(item?: any) {
    this.displayBasic = !this.displayBasic;
    this.itemRow = item;
    this.notes = item && item.note ? item.note : '';
    return (calBack) => calBack;
  }
  showDeletemodal(item) {
    this.deletedItem = item;
    this.displayBasicDelete = !this.displayBasicDelete;
  }
  No() {
    this.displayBasic = !this.displayBasic;
  }
  noDelete() {
    this.displayBasicDelete = !this.displayBasicDelete;
  }
  /**
   * Block a single Item from the Table
   * @param {BlockItemInterface} data - The item ID and Block State
   * @param {*} item - The full object of the selected item
   * @returns {void}
   * @memberof TableComponent
   */
  toggleBlock(): void {
    const data = {
      id: this.itemRow[this.id],
      isBlock: this.itemRow.isBlock,
      note: this.notes,
    };

    const unblockUrl: string = this.url.unblock || this.url.block;
    const url: string = data.isBlock ? unblockUrl : this.url.block;

    if (url)
      this.tableCore
        .toggleBlock(url, data, this.itemRow)
        .pipe(take(1))
        .subscribe(() => this.getTableData());
    this.displayBasic = !this.displayBasic;
  }

  /**
   * Fire When The Table Page Changes
   * @param {*} pageInfo - The Object For Table Pages
   * @memberof TableComponent
   */
  setPage(pageInfo: any): void {
    this.first = pageInfo.first;
    this.tableCore.pageOptions.offset = pageInfo.first / pageInfo.rows;
    this.tableCore.pageOptions.limit = pageInfo.rows;
    if (this.firstInit) this.getTableData();
  }

  /**
   * Search For Each Table Column
   * @param {*} pageInfo - Table Page Info Event
   * @memberof ListComponent
   */
  columnSearchHandle(searchValue: string, colId: string): void {
    if (colId === 'id') {
      this.tableCore.searchNew$.next({
        ...this.tableCore.searchNew$.value,
        [colId]: searchValue ? searchValue : 0,
      });
    } else {
      this.tableCore.searchNew$.next({
        ...this.tableCore.searchNew$.value,
        [colId]: searchValue,
      });
    }
  }

  /**
   * Search Functionality for Each Column with typing
   * Then call the backend to get the matched search criteria
   * @memberof TableComponent
   */
  columnSearchInput(): void {
    this.tableCore.searchNew$
      .pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search) => {
        const hasSearch = Object.keys(search).length;

        if (!this.clientSide && hasSearch) {
          this.resetPageOptions();
          this.getTableData();
        }
      });
  }

  /**
   * Reset
   *
   * @memberof ListComponent
   */
  resetPageOptions() {
    this.tableCore.pageOptions = {
      count: -1,
      offset: 0,
      limit: 10,
      searchKey: '',
      isSearchFilter: this.tableCore.pageOptions.isSearchFilter,
    };
  }

  onRowSelect(event) {
    this.selected.emit(this.selectedData);
  }

  onRowUnselect(event) {
    this.selected.emit(this.selectedData);
  }
  copyToClipboard(elementId) {
    var copyText = document.getElementById(elementId);
    var textArea = document.createElement('textarea');
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    textArea.remove();
  }
  filterDate() {
    return true;
  }
  checkActions(row) {
    let show = true;
    if (row.hasOwnProperty('status') && row.status == 'Completed') show = false;
    else if (row.hasOwnProperty('statusEn') && row.statusEn == 'Completed')
      show = false;
    return show;
  }

  goToDeatils(rowData) {
    if (this.router.url?.endsWith('all')) {
      this.router.navigate(['../details', rowData?.id], {
        relativeTo: this.route.parent,
      });
    } else {
      if (!rowData.id && rowData.ticketId) {
        rowData.id = rowData.ticketId;
      }
      if (rowData.id && rowData.ticketId) {
        rowData.id = rowData.ticketId;
      }
      if (!rowData.id && rowData.scheduleId) {
        rowData.id = rowData.scheduleId;
      }
      if (this.options.viewDetailsURL?.at(-1) != '/') {
        this.options.viewDetailsURL = this.options.viewDetailsURL + '/';
      }
      this.router.navigate([this.options.viewDetailsURL + rowData?.id]);
    }
  }
  convertToKebabCase(input: string): string {
    return input
      .toLowerCase() // Convert the string to lowercase
      .replace(/&/g, 'and') // Replace '&' with 'and' if needed
      .replace(/[^\w\s-]/g, '') // Remove any non-word characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace one or more spaces with a hyphen
      .replace(/-+/g, '-');
  }

  navigateToUrl(url, row) {
    let routeId = row.merchantId;
    if (!row.id && row.ticketId) {
      routeId = row.merchantId;
    } else if (row.id && row.terminalId) {
      routeId = row.merchantId;
    } else {
      routeId = row.id;
    }
    this.router.navigate([url + routeId]);
  }

  checkTemplate(fields: Array<any>) {
    return fields.some((x) => x.custom == 'image');
  }
  getTemplate(fields, rowData) {
    const tempFields = [...fields];
    const fieldsWithoutImage = tempFields.filter(
      (x) => x.custom != 'image' && x.custom != 'email'
    );
    const fieldCombined = {
      label: '',
      custom: 'default',
    };
    fieldsWithoutImage.forEach((x) => {
      fieldCombined.label += rowData[x.label] + ' ';
    });
    const emailItem = {
      label: rowData[tempFields.find((x) => x.custom == 'email').label],
      custom: 'default',
    };
    let item = {
      list: [fieldCombined, emailItem],
      imageItem: tempFields.find((x) => x.custom == 'image'),
    };
    return item;
  }

  toggleFavourite(row) {
    let isFavorite = !row.isFavourite;
    this.service
      .Favorite({ id: row?.id, isFavorite: isFavorite })
      .subscribe((resp) => {
        if (resp.success) {
          const message = isFavorite
            ? 'Add to favorites successfully'
            : 'Removed from favorites successfully';
          // this.toaster.toaster.clear();
          this.toaster.showSuccess(message);
          row.isFavourite = isFavorite;
          // return row;
          this.getTableData();
        }
      });
  }
  toggleActionBlock(row) {
    const isBlock = !row.isBlock;
    const action = isBlock ? 'block' : 'unblock';
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
      .Block({ id: row.id, isBlock: isBlock })
      .pipe(takeWhile(() => this.alive))
      .subscribe((response) => {
        if (response.success) {
          const message = isBlock
            ? 'Blocked successfully'
            : 'Unblocked successfully';
          this.toaster.showSuccess(message);
          row.isBlock = isBlock; // Update the row's block status
          if (row.hasOwnProperty('status')) {
            row.status = isBlock ? 'Blocked' : response.data.status;
          }
          if (row.hasOwnProperty('statusEn')) {
            row.statusEn = isBlock ? 'Blocked' : response.data.status;
          }
          // this.updateActions(row);
          // this.getTableData();
        }
      });
    //   }
    // });
  }
  goToEdit(rowData) {
    let id = '';
    if (rowData.id) {
      id = rowData.id;
    } else if (!rowData.id && rowData.userId) {
      id = rowData.userId;
    } else if (!rowData.id && rowData.ticketId) {
      id = rowData.ticketId;
    }
    // console.log(rowData, this.options.editURL);
    this.router.navigate([this.options.editURL + id]);
  }
  goToClone(rowData) {
    let id = '';
    if (rowData.id) {
      id = rowData.id;
    } else if (!rowData.id && rowData.userId) {
      id = rowData.userId;
    } else if (!rowData.id && rowData.ticketId) {
      id = rowData.ticketId;
    }
    // console.log(rowData, this.options.editURL);
    this.router.navigate([this.options.cloneURL + id]);
  }

  previousPage() {
    const pageIndex = this.first / this.tableCore.pageOptions.limit;

    if (pageIndex > 0) {
      this.tableCore.pageOptions.offset = pageIndex;
      this.first -= this.rows;
      this.getTableData();
    }
  }

  nextPage() {
    const pageIndex = this.first / this.tableCore.pageOptions.limit;
    const totalPages = Math.ceil(
      this.tableCore.pageOptions.count / this.tableCore.pageOptions.limit
    );

    if (pageIndex < totalPages - 1) {
      this.tableCore.pageOptions.offset = pageIndex;
      this.first += this.rows;
      this.getTableData();
    }
  }

  updateCurrentPage() {
    this.currentPage =
      Math.floor(this.first / this.tableCore.pageOptions.limit) + 1;
  }

  ShowBlockDialog(rowData) {
    if (rowData) {
      const isBlock = !rowData.isBlock;
      let message = `Are you sure you want to ${
        isBlock ? 'block' : 'unblock'
      } this ${this.modulePageName ? this.modulePageName : 'item'}?`;
      this.confirmationService.confirm({
        header: `${isBlock ? 'Block' : 'Unblock'} ${this.modulePageName}`,
        message: message,
        acceptIcon: 'pi pi-check mr-2',
        rejectIcon: 'pi pi-times mr-2',
        rejectButtonStyleClass: 'p-button-sm',
        acceptButtonStyleClass: 'p-button-outlined p-button-sm',
        accept: () => {
          this.toggleActionBlock(rowData);
        },
        reject: () => {},
        acceptLabel: `Yes, ${isBlock ? 'Block' : 'Unblock'}`,
        rejectLabel: 'No, Cancel',
      });
    }
  }
  rowActionClicked(rowData, action) {
    this.rowClickedAction.emit({ rowData, action });
  }
}
