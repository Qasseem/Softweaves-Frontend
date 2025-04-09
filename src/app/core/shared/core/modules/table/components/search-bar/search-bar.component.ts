import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';

import { SearchFilterService } from './services/search-filter.service';
import { SearchInterface } from '../../models/search-interface';
import { AppTranslateService } from 'src/app/core/shared/services/translate.service';
import { TableCoreService } from '../../services/table-core.service';
import {
  HTTPMethods,
  ModulesReferencesEnum,
  SearchInputTypes,
} from '../../models/enums';
import {
  TableButtonsExistanceInterface,
  TableUrlInterface,
} from '../../models/table-url.interface';
import { ToastService } from 'src/app/core/services/toaster.service';
import {
  ActionsInterface,
  ActionsTypeEnum,
} from '../../models/actions.interface';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'oc-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.sass'],
})
export class SearchBarComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('op') mySearchDialog: any;
  apis: any;
  InputSearch$ = new Subject<string>();
  @Input() url: TableUrlInterface;
  @Input() buttonsExistance: TableButtonsExistanceInterface;
  @Output() getListData = new EventEmitter();
  @Output() searchFilterTriggered = new EventEmitter();
  @Output() emitFormValue = new EventEmitter();
  @Output() emitSearchKeyValue = new EventEmitter();
  isDataLOadedOnce = false;
  @Input() filtersInput: SearchInterface[] = [];
  @Input() searchOnly = false;
  @Input() StyleInput = '';
  @Input() addButtonLabel = 'Add';
  @Input() uploadHeader = 'Upload';
  @Input() styleContainer =
    'border-radius: 0.4rem ;height: 50px;background-color: white;width: 651px ;margin: 10px; border: 1px solid #C3C3C3;';
  @Input() additionalField = true;
  @Input() placeholderSearch = 'Search';
  @Input() styleObj = {
    width: '1080px',
    'z-index': '9',
    'margin-top': '30px',
  };
  @Input() taskSearchHistoryObj = {};
  @Input() sampleName = '';
  @Input() hasCustomFilter: boolean = false;
  @Input() gridActionsList: ActionsInterface[] = [];

  filtersForm: UntypedFormGroup;
  filterControls;
  unPinnedControls;
  isFilterForm = true;
  moduleReference: string;
  controlsCount = 0;
  formValueDictionary = {};
  formValueDictionaryTooltip = {};
  tooltipData = [];
  radioModel = 'Lefts';
  lastFormValue: any;
  isSearchedBefore: boolean;
  //var to assign the search text from history if exist
  inputTextHistoryValue: string;
  //var to assign the search form value from history if exist
  formHistoryData: any;
  taskListFormData: any;
  fileToUpload: any;

  clickedAction: ActionsInterface;

  openFileDialog(action: ActionsInterface) {
    this.clickedAction = action;
    this.uploadHeader = action.uploadFileData.header;
    this.sampleName = action.uploadFileData.templateName;
    this.url.import = action.uploadFileData.url;
    this.visible = true;
  }

  constructor(
    public language: AppTranslateService,
    private tableCoreService: TableCoreService,
    private router: Router,
    private route: ActivatedRoute,
    private searchFilterService: SearchFilterService,
    private toaster: ToastService,
    public authService: AuthService
  ) {
    this.moduleReference = ModulesReferencesEnum[this.router.url.split('/')[2]];

    // create a empty FormGroup
    this.filtersForm = new UntypedFormGroup({});
  }
  ngAfterViewInit(): void {}

  //this method is for task module history search
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.taskSearchHistoryObj?.currentValue) {
      if (changes?.taskSearchHistoryObj.currentValue?.toolTipData) {
        this.formValueDictionaryTooltip =
          changes?.taskSearchHistoryObj.currentValue?.toolTipData;
        this.convertObjToArray();
        this.taskListFormData = changes?.taskSearchHistoryObj.currentValue;
      }
      if (changes?.taskSearchHistoryObj.currentValue?.searchKey) {
        this.inputTextHistoryValue =
          changes?.taskSearchHistoryObj.currentValue?.searchKey;
      }
    }
  }
  ngOnInit() {
    //check if there is any history for the activated page
    if (this.tableCoreService.gridSearchHistory[this.router.url]) {
      //assign the search ker if exist in history obj
      this.inputTextHistoryValue =
        this.tableCoreService.gridSearchHistory[this.router.url].searchKey;
      //check if there is any toolTip data in search history obj
      if (
        this.tableCoreService.gridSearchHistory[this.router.url].search
          .toolTipData
      ) {
        //assign the tool tip data if exist in history obj
        this.formHistoryData = this.formValueDictionaryTooltip =
          this.tableCoreService.gridSearchHistory[this.router.url].search;
        this.formValueDictionaryTooltip =
          this.tableCoreService.gridSearchHistory[
            this.router.url
          ].search.toolTipData;
        this.convertObjToArray();
      }
    }

    this.searchOnType();
    this.checkActionPermissions();
  }
  checkActionPermissions() {
    if (this.gridActionsList.length > 0) {
      this.gridActionsList.forEach((action) => {
        action.showAction = this.authService.hasPermission(action.permission);
      });
    }
  }
  getDDLData(item) {
    let targetedApi;
    if (
      HTTPMethods.getReq &&
      (item?.header || item?.header == '0' || item?.header == 0)
    ) {
      targetedApi = this.searchFilterService.getDataWithHeader(
        item.url,
        item?.header
      );
    } else {
      targetedApi =
        item.method == HTTPMethods.getReq
          ? this.searchFilterService.getData(item.url)
          : this.searchFilterService.getDataWithPostCall(item.url);
    }

    targetedApi.pipe(take(1)).subscribe((resp) => {
      if (
        this.filtersInput.find((x) => x.field == item.field).type ==
        SearchInputTypes.select
      ) {
        resp.data.forEach((item) => {
          item.searchKey =
            (item?.id ?? '') +
            (item.nameEn ?? '') +
            (item?.nameAr ?? '') +
            (item?.merchantId ?? '');
          item?.code ? (item.code = item.code.trim()) : '';
        });

        this.filtersInput.find((x) => x.field == item.field).ddlData =
          resp.data;
      } else {
        resp.data?.data?.forEach((item) => {
          item.searchKey = item.searchKey =
            (item?.id ?? '') +
            (item.nameEn ?? '') +
            (item?.nameAr ?? '') +
            (item?.merchantId ?? '');
          item?.code ? (item.code = item.code.trim()) : '';
        });
        this.filtersInput.find((x) => x.field == item.field).ddlData =
          resp.data?.data;
      }
    });
  }

  async createForms() {
    if (this.filtersInput) {
      this.filterControls = this.filtersInput.filter((ctr) => {
        return ctr.isFixed || ctr.isPinned;
      });
      this.unPinnedControls = this.filtersInput.filter((ctr) => {
        return !ctr.isFixed;
      });
      for (const ctrl of this.filterControls) await this.createControls(ctrl);

      //check if there is any form data for filters history obj and fill the search form with history data with deep copy
      if (this.formHistoryData) {
        let copiedFormValue = Object.assign({}, this.formHistoryData);
        delete copiedFormValue.toolTipData;
        this.filtersForm.setValue(copiedFormValue);
      }
      if (this.taskListFormData) {
        this.filtersForm.patchValue(this.taskListFormData);
      }
      if (this.hasTwoFields(this.filtersInput, 'category', 'errandType')) {
        this.filtersForm.get('category').valueChanges.subscribe({
          next: (val) => {
            if (val) {
              const item = this.filtersInput.find(
                (x) => x.field == 'errandType'
              );
              if (item) {
                item.header = !Array.isArray(val) ? val : '0';
                this.getDDLData(item);
              }
            }
          },
        });
      }
      if (this.hasThreeFields(this.filtersInput, 'region', 'city', 'zone')) {
        this.filtersForm.get('region').valueChanges.subscribe({
          next: (val) => {
            this.filtersForm.get('city').setValue(null);
            if (val) {
              const item = this.filtersInput.find((x) => x.field == 'city');
              if (item) {
                item.header = !Array.isArray(val) ? val : '0';
                this.getDDLData(item);
              }
            }
          },
        });
        let isZoneHidden = this.filtersInput.find(
          (x) => x.field == 'zone'
        )?.hidden;
        if (!isZoneHidden) {
          this.filtersForm.get('city').valueChanges.subscribe({
            next: (val) => {
              if (val) {
                const item = this.filtersInput.find((x) => x.field == 'zone');
                if (item) {
                  item.header = !Array.isArray(val) ? val : '0';
                  this.getDDLData(item);
                }
              }
            },
          });
        }
      }
    }
  }
  hasTwoFields(objects: any[], field1: string, field2: string): boolean {
    // Flags to track if the desired fields are found
    let foundField1 = false;
    let foundField2 = false;

    // Iterate over the array and set flags when fields are found
    for (const obj of objects) {
      if (obj.field === field1) {
        foundField1 = true;
      }
      if (obj.field === field2) {
        foundField2 = true;
      }
      // Early exit if both fields are found
      if (foundField1 && foundField2) {
        return true;
      }
    }

    // Return true only if both fields were found
    return false;
  }
  hasThreeFields(
    objects: any[],
    field1: string,
    field2: string,
    field3: string
  ): boolean {
    // Flags to track if the desired fields are found
    let foundField1 = false;
    let foundField2 = false;
    let foundField3 = false;

    // Iterate over the array and set flags when fields are found
    for (const obj of objects) {
      if (obj.field === field1) {
        foundField1 = true;
      }
      if (obj.field === field2) {
        foundField2 = true;
      }
      if (obj.field === field3) {
        foundField3 = true;
      }
      // Early exit if both fields are found
      if (foundField1 && foundField2 && foundField3) {
        return true;
      }
    }

    // Return true only if both fields were found
    return false;
  }
  async createControls(ctrl) {
    const formControl = this.createControl(ctrl);
    if (ctrl.type === SearchInputTypes.range) {
      const formControl1 = this.createControl(ctrl);
      const formControl2 = this.createControl(ctrl);

      this.filtersForm.addControl(ctrl.field + 'From', formControl1);
      this.filtersForm.addControl(ctrl.field + 'To', formControl2);
    } else this.filtersForm.addControl(ctrl.field, formControl);
  }
  // function for create FormControl
  private createControl(ctrl): UntypedFormControl {
    if (ctrl.type === SearchInputTypes.text) return new UntypedFormControl('');
    else if (ctrl.type === SearchInputTypes.choice && ctrl.isMultiple)
      return new UntypedFormControl([]);
    else if (ctrl.type === SearchInputTypes.choice && !ctrl.isMultiple)
      return new UntypedFormControl(null);
    // in case of select is single set it`s from value as null object
    else if (ctrl.type === SearchInputTypes.select && !ctrl.isMultiple)
      return new UntypedFormControl(null);
    else if (ctrl.type === SearchInputTypes.selectValue)
      return new UntypedFormControl(null);
    else if (
      ctrl.type === SearchInputTypes.range ||
      ctrl.type === SearchInputTypes.number
    )
      return new UntypedFormControl(null);
    else return new UntypedFormControl([]);
  }

  async search() {
    this.searchFilterTriggered.emit(true);
    const toolTipData = await this.prepareTooltipData();
    //addd tool tip data with form value to store it in search history obj to retriev later
    const searchObjWithToolTipData = { ...this.filtersForm.value, toolTipData };
    this.emitFormValue.next(searchObjWithToolTipData);
    this.tableCoreService.pageOptions.isSearchFilter = true;
    this.lastFormValue = this.filtersForm.value;
    this.tableCoreService.searchNew$.next(searchObjWithToolTipData);
    this.mySearchDialog.hide();
    this.isSearchedBefore = true;
  }
  async prepareTooltipData() {
    this.formValueDictionaryTooltip = {};
    Object.keys(this.filtersForm.controls).forEach((key) => {
      if (
        this.filtersForm.get(key).value?.length ||
        (!Array.isArray(this.filtersForm.get(key).value) &&
          this.filtersForm.get(key).value)
      ) {
        if (this.formValueDictionary[key]) {
          this.formValueDictionaryTooltip[key] = this.formValueDictionary[key];
        }
      }
    });
    return this.formValueDictionaryTooltip;
  }

  addNewFilter() {
    this.isFilterForm = false;
  }

  resetToDefaults() {
    this.filterControls.map((ctrl) => {
      if (!ctrl.isPinned && !ctrl.isFixed) {
        this.filtersForm.removeControl(ctrl.field);
        this.filterControls = this.filterControls.filter(
          (el) => el.field !== ctrl.field
        );
        ctrl.selectedToFilter = false;
      }
    });
    this.filterControls = [...this.filterControls];
    this.filtersForm.updateValueAndValidity();
  }

  //this method used to rest form value to its initials (empty array or empty string)
  resetForm() {
    Object.keys(this.filtersForm.controls).forEach((key) => {
      if (Array.isArray(this.filtersForm.get(key).value)) {
        this.filtersForm.get(key).setValue([]);
      } else {
        this.filtersForm.get(key).setValue('');
      }
    });
    this.formValueDictionary = {};
  }

  searchOnType() {
    this.InputSearch$.pipe(debounceTime(700), distinctUntilChanged()).subscribe(
      (searchValue) => {
        this.emitSearchKeyValue.emit(searchValue);
        if (this.url.refScope && this.url.refId) {
          this.tableCoreService.refId = parseInt(this.url.refId);
          this.tableCoreService.refScope = this.url.refScope;
        }

        this.tableCoreService.pageOptions.searchKey = searchValue;
        this.tableCoreService.pageOptions.isSearchFilter = false;
        this.resetForm();
        this.tooltipData = [];
        this.tableCoreService.searchNew$.next({});
        this.getListData.emit(true);
      }
    );
  }
  SearchAll(value) {}
  dismissed(event) {
    // if (this.lastFormValue && this.isSearchedBefore)
    //   this.filtersForm.setValue(this.lastFormValue);
    this.convertObjToArray();
  }

  getSelectedData(event, ctrlName) {
    if (event) {
      let propValue = '';
      if (Array.isArray(event?.value)) {
        event?.value.map((item) => {
          this.language.currentLanguage() === 'en'
            ? (propValue += item?.nameEn + ', ')
            : (propValue += item.nameAr + +', ');
        });
        propValue = propValue.slice(0, -2);
      } else {
        this.language.currentLanguage() === 'en'
          ? (propValue = event?.value?.nameEn)
          : (propValue = event?.value?.nameAr);
      }
      this.formValueDictionary[ctrlName] = propValue ? propValue : event.value;
    }
  }
  getInputData(value, ctrlName) {
    if (value) this.formValueDictionary[ctrlName] = value;
  }
  getInputRangeData(value, ctrlName, source) {
    if (value) {
      source === 'from'
        ? (this.formValueDictionary[ctrlName + 'From'] = value)
        : (this.formValueDictionary[ctrlName + 'To'] = value);
    }
  }
  getDateData(value, ctrlName, pickerType) {
    if (value && pickerType !== 'timer') {
      let propValue = '';
      value.map((item) => {
        if (item) propValue += item.toLocaleDateString() + ' To ';
      });
      propValue = propValue.substring(0, propValue.length - 4);
      this.formValueDictionary[ctrlName] = propValue;
    }
    if (value && pickerType == 'timer') {
      let propValue = '';
      value.map((item) => {
        if (item) propValue += item.toLocaleTimeString('en-US') + ' To ';
      });
      propValue = propValue.substring(0, propValue.length - 4);
      this.formValueDictionary[ctrlName] = propValue;
      if (!value[1] || !value[0]) {
        this.filtersForm.get(ctrlName).setValue(null);
      }
    }
  }
  convertObjToArray() {
    this.tooltipData = Object.keys(this.formValueDictionaryTooltip).map(
      (key) => [String(key), this.formValueDictionaryTooltip[key]]
    );
  }
  show(event) {
    if (!this.isDataLOadedOnce) {
      this.isDataLOadedOnce = true;
      this.createForms();
      this.filtersInput.map((item) => {
        if (
          (item.isFixed && item.url && item.type == SearchInputTypes.choice) ||
          (item.isFixed && item.url && item.type == SearchInputTypes.select)
        ) {
          if (!item.serverSide) {
            this.getDDLData(item);
          }
        }
      });
    }
  }
  //delete the search data history for this activated route incase the user delete the search text by himself to prevent applying search
  inputText(event) {
    this.searchFilterTriggered.emit(true);
    if (event == null || event == '') {
      delete this.tableCoreService.gridSearchHistory[this.router.url];
    }
  }
  navigateToAdd() {
    if (this.router.url?.endsWith('all')) {
      return this.router.navigate(['../add'], {
        relativeTo: this.route.parent,
      });
    } else {
      return this.router.navigate(['add'], {
        relativeTo: this.route.parent,
      });
    }
  }
  export() {
    if (this.url.export) {
      this.tableCoreService.exportTable(this.url.export).subscribe();
    }
  }

  exportDetails() {
    if (this.url.exportDetails) {
      this.tableCoreService.exportTable(this.url?.exportDetails).subscribe();
    }
  }

  showImportDialog(key?: any) {
    switch (key) {
      case 'visit': {
        this.uploadHeader = 'Upload Bulk Visit & Sales';
        this.sampleName = 'ImportTicketVisitSalesTemplate.xlsx';
        this.url.import = '/Ticket/ImportVisitAndSales';
        break;
      }
      case 'cancel': {
        this.uploadHeader = 'Upload Bulk Cancellation';
        this.sampleName = 'ImportTicketCancellationTemplate.xlsx';
        this.url.import = '/Ticket/ImportTickets';
        break;
      }
      case 'status': {
        this.uploadHeader = 'Change Status';
        this.sampleName = 'TicketChangeStatusTemplate.xlsx';
        this.url.import = '/Ticket/ImportChangeStatus';
      }
    }
    this.visible = true;
  }
  visible = false;

  filesSelectedEvent(event) {
    if (event.length) {
      this.fileToUpload = event[0];
    }
  }
  importFromFile() {
    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    this.tableCoreService
      .import(this.url.import, formData)
      .subscribe((resp) => {
        if (resp.success) {
          this.visible = false;
          // location.reload();
          const message = 'Import Completed Successfully';
          this.toaster.showSuccess(message);
          this.getListData.next(true);
          if (resp.data) {
            this.downloadFile(resp.data);
          }
        }
      });
  }

  downloadFile(url: string): void {
    window.open(url, '_blank');
  }

  customFilter(value: any, filter: string): boolean {
    const bindValue = 'id'; // The property you want to filter by
    const searchTerm = filter.toLowerCase();

    // Filter logic based on the bindValue
    return value[bindValue]?.toString().toLowerCase().includes(searchTerm);
  }

  actionClicked(action: ActionsInterface) {
    if (action.type == ActionsTypeEnum.File) {
      this.openFileDialog(action);
    } else {
      action.call();
    }
  }
}
