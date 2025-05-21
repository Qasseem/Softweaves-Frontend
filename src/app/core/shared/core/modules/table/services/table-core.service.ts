import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';
import { map, take } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { BlockItemInterface } from '../models/block.interface';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TableCoreService {
  public pageOptions = {
    count: -1,
    offset: 0,
    limit: 10,
    searchKey: '',
    isSearchFilter: false,
  };
  refId: number;
  refScope = '';
  public search: string;
  public searchNew: {};
  public searchNew$: BehaviorSubject<{}> = new BehaviorSubject({});
  public filterClick$: BehaviorSubject<{}> = new BehaviorSubject({});
  //var to store search history to use it when redirect back to the same page
  gridSearchHistory = {};
  public tableData: any[] = [];
  //activated page current url used to name the history property for each page
  currentRoute: string;

  constructor(private http: HttpService, private router: Router) {
    //subscription for activated page current url used to name the history property for each page
    this.currentRoute = this.router.url;
    this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.currentRoute = value.url;
      }
    });
  }

  /**
   * Get The Grid data from a givin link to the endpoint
   * @param {string} url - The endpoint URL
   * @returns {Observable<any>}
   * @memberof TableCoreService
   */
  getAllData(url: string, params?: any): Observable<any> {
    this.tableData = [];
    let options = this.getRequestObject();
    if (params && !Object.keys(params).includes('refId')) {
      delete options.refId;
    } else if (this.refScope && this.refId) {
      params = { ...params, id: this.refId };
    }
    options = { ...options, ...params };
    options = this.getSearchHistory(options);

    return this.http.postReq(url, options).pipe(
      take(1),
      map((resp: any) => {
        if (resp.success) {
          this.tableData = resp.data.data;
          this.pageOptions.count = resp.data.listCount;
          this.pageOptions.offset = resp.data.pageNumber;
          this.pageOptions = { ...this.pageOptions };
        }
      })
    );
  }

  /**
   * Delete Single Item with given URL and Item ID
   * @param {string} url - EndPoint URL
   * @param {string} id - Item Id
   * @returns {Observable<any>}
   * @memberof TableCoreService
   */
  deleteItem(url: string, id: string): Observable<any> {
    return this.http.deleteReq(url, id).pipe(
      take(1),
      map((resp: any) => {
        if (!resp.success) {
          return;
        }
      })
    );
  }

  /**
   * Delete Selected Items with given URL and Items IDs
   * @param {string} url - EndPoint URL
   * @param {number[]} ids - Items Ids
   * @returns {Observable<any>}
   * @memberof TableCoreService
   */
  deleteSelectedItems(url: string, ids: number[]): Observable<any> {
    return this.http.putReq(url, ids).pipe(
      take(1),
      map((resp: any) => {
        if (!resp.success) return;
      })
    );
  }

  /**
   * Toggle The Block State for a Givin Item
   * @param {string} url - EndPoint URL
   * @param {BlockItemInterface} blockData - Item ID and Block State
   * @param {*} item - The full object of the selected item
   * @returns {Observable<any>}
   * @memberof TableCoreService
   */
  toggleBlock(
    url: string,
    blockData: BlockItemInterface,
    item?: any
  ): Observable<any> {
    blockData.isBlock = !blockData.isBlock;
    return this.http.putReq(url, blockData).pipe(
      take(1),
      map((resp: any) => {
        blockData.isBlock = !blockData.isBlock;
        if (resp.success) {
          blockData.isBlock = !blockData.isBlock;
          // Refresh the block data without calling the backend
          this.tableData.find((row) => row === item).isBlock =
            !this.tableData.find((row) => row === item).isBlock;
          this.tableData = [...this.tableData];
        }
      })
    );
  }

  /**
   * Export the table content
   * @param {string} url - EndPoint URL
   * @param {string[]} selectedColumns - The Selected Columns Array
   * @returns {Observable<any>}
   * @memberof TableCoreService
   */
  exportTable(url: string): Observable<any> {
    let options = this.getRequestObject();
    options = this.getSearchHistory(options);
    return this.http.postReq(url, options).pipe(
      take(1),
      map(({ success, data }) => !success || (window.location.href = data))
    );
  }

  pinFilter(filterParams): Observable<any> {
    return this.http.postReq('', filterParams);
  }
  unPinFilter(filterParams): Observable<any> {
    return this.http.postReq('', filterParams);
  }
  restoreFilters(moduleId): Observable<any> {
    return this.http.postReq('', { moduleId });
  }

  getSearchHistory(options) {
    //check if the activated page comes with empty search obj to assignee history to it if exist.
    if (
      this.pageOptions.isSearchFilter == false &&
      (this.pageOptions.searchKey == '' ||
        this.pageOptions.searchKey == null ||
        this.pageOptions.searchKey == undefined)
    ) {
      //check if there is any history if exist assign it to search obj
      if (this.currentRoute && this.gridSearchHistory[this.currentRoute]) {
        options = this.gridSearchHistory[this.currentRoute];
      }
    } else {
      //check if the search obj has value then add it to search history
      this.gridSearchHistory[this.currentRoute] = options;
    }
    return options;
  }
  getRequestObject() {
    return {
      isSearchFilter: this.pageOptions.isSearchFilter,
      searchKey: this.pageOptions.searchKey,
      search: this.searchNew$.value,
      pageSize: this.pageOptions.limit,
      pageNumber: this.pageOptions.offset,
      searchCriteria: this.search,
      refId: 0,
      merchantId: 0,
      terminalId: 0,
    };
  }

  import(url: string, data) {
    return this.http.postReq(url, data);
  }
}
