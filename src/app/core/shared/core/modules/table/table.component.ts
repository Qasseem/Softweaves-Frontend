import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ActionsInterface,
  ViewCustomPermission,
} from './models/actions.interface';
import { TableOptionsInterface } from './models/options.interface';
import { ColumnsInterface } from './models/columns.interface';
import {
  TableButtonsExistanceInterface,
  TableUrlInterface,
} from './models/table-url.interface';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  take,
  takeUntil,
} from 'rxjs/operators';
import { TableCoreService } from './services/table-core.service';
import { Subject } from 'rxjs';
import { SearchInterface } from './models/search-interface';
import { ListComponent } from './components/list/list.component';
import { AppTranslateService } from '../../../services/translate.service';

@Component({
  selector: 'oc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass'],
})
export class TableComponent implements OnInit, OnDestroy {
  @ViewChild('top') public top: ElementRef;
  @Input() data: any[];
  @Input() url: TableUrlInterface;
  @Input() columns: ColumnsInterface[];
  @Input() actions: ActionsInterface[];
  @Input() filters: SearchInterface[];
  @Input() addDropdown;
  @Input() selectedData: any[];
  @Input() id = 'id';
  @Input() addButtonLabel = 'Add';
  @Input() test_id;
  @Input() options: TableOptionsInterface;
  @Input() clientSide = false;
  @Input() showSearchBar = false;
  @Input() all = true;
  @Input() searchOnly = false;
  @Input() additionalField = true;
  @Input() showHeader = true;
  @Input() headerName: string;
  @Input() reloadIfUpdated = false;
  @Input() placeholderSearch = 'Search';
  @Input() noDataText = '';
  @Output() CustomButtonClicked = new EventEmitter();
  @Input() viewCustomPermission: ViewCustomPermission;
  @Input() exportUrl: any;
  @Input() buttonsExistance: TableButtonsExistanceInterface;
  @Input() uploadHeader = 'Upload';
  @Input() sampleName = '';
  @Input() service: any;
  @Input() customFilter: boolean = false;
  @Input() modulePageName = '';
  @Input() gridActionsList: ActionsInterface[] = [];

  first = 0;

  globalSearch: UntypedFormGroup;
  isCollapsed: boolean;
  toggle: boolean = true;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild(ListComponent) child: ListComponent;

  selectedIds: any = [];

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public lang: AppTranslateService,
    private fb: UntypedFormBuilder,
    private tableCore: TableCoreService
  ) {
    //set componentFirstEntry var to true to mark this component as a first load.
    this.isCollapsed = true;
  }
  ngOnChanges() {
    if (this.reloadIfUpdated) {
      this.getTableData();
      this.reloadIfUpdated = false;
    }
  }
  ngOnInit() {
    this.buildForm();
    this.searchInput();

    this.options = {
      add: true,
      search: false,
      reorder: false,
      loading: false,
      details: true,
      check: true,
      columnSearch: true,
      globalSearch: false,
      ...this.options,
    };
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    if (this.top) {
      this.top.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'end',
      });
    }
  }
  canceled() {}
  deleteSelected() {
    this.toggle = false;
    this.selectedIds = this.selectedData.map((item) => item[this.id]);

    this.tableCore
      .deleteSelectedItems(this.url.deleteAll, this.selectedIds)
      .pipe(take(1))
      .subscribe(() => {
        this.getTableData();
        this.selectedData = [];
        this.isCollapsed = true;
      });
  }

  /**
   * Handle the global search input and update the table data
   * @memberof TableComponent
   */
  searchInput(): void {
    this.globalSearch.controls.search.valueChanges
      .pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((resp: any) => {
        this.tableCore.search = resp;
        this.getTableData();
      });
  }

  /**
   * Get the Table Data from the Service
   * @memberof TableComponent
   */
  getTableData(): void {
    if (this.url && this.url.getAll) {
      this.tableCore
        .getAllData(this.url.getAll)
        .pipe(take(1))
        .subscribe(() => {
          this.data = this.tableCore.tableData;
          this.toggle = true;
        });
    }
  }
  searchFilterTriggered(event) {
    this.child.reset();
  }
  getTableDataFromSearchBar() {
    this.child.reset();
    this.tableCore.pageOptions.offset = 0;
    this.getTableData();
  }
  /**
   * Get the selected array from the list child component
   * @param {any[]} selected
   * @memberof TableComponent
   */
  getSelected(selected: any[]): void {
    if (selected.length) this.isCollapsed = false;
    else this.isCollapsed = true;

    this.selectedData = selected;
    this.selectedIds = this.selectedData.map((item) => item[this.id]);
  }

  /**
   * On Select some items from the check boxes
   * @param {*} { selected }
   * @memberof TableComponent
   */
  // onSelect({ selected }: any) {
  //   if (selected) {
  //     this.selected.splice(0, this.selected.length);
  //     this.selected.push(...selected);
  //   }
  // }

  /**
   * Navigate to Add Item Page
   * @returns {Promise<boolean>}
   * @memberof TableComponent
   */
  goToAddPage(): Promise<boolean> {
    return this.router.navigate([this.router.url + '/add']);
    return this.router.navigate(['../add'], { relativeTo: this.route.parent });
  }

  /**
   * Build the global search form
   * @memberof TableComponent
   */
  buildForm(): void {
    this.globalSearch = this.fb.group({
      search: [''],
    });
  }
  goToCustomPage(customButtonObj) {
    if (customButtonObj?.url) {
      return this.router.navigate([customButtonObj?.url]);
    } else {
      this.CustomButtonClicked.emit(customButtonObj);
    }
    return this.router.navigate(['./home']);
  }
}

// NOTES:
// - Flag to choose between server and client side operations {{ IMPORTANT }}
// - Fix the auto complete selector for fit the table cell
// - Add Option Input For Table Row Height
// - Sort With Server Side Pagination
