import { Injectable, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BlockItemInterface } from '../models/block.interface';
import {
  NavigationStart,
  NavigationEnd,
  Router,
  Event as RouterEvent,
} from '@angular/router';

export interface TablePageOptions {
  count: number;
  offset: number;
  limit: number;
  searchKey: string;
  isSearchFilter: boolean;
}

export interface TableState {
  isSearchFilter: boolean;
  searchKey: string;
  search: any;
  pageSize: number;
  pageNumber: number;
  searchCriteria: string;
  refId: number;
  // any other metadata you want to persist per route
}

@Injectable({ providedIn: 'root' })
export class TableCoreService implements OnDestroy {
  // --- public state used by components ---
  public pageOptions: TablePageOptions = {
    count: -1,
    offset: 0,
    limit: 10,
    searchKey: '',
    isSearchFilter: false,
  };

  public refId: number | null = null;
  public refScope = '';
  public search: string = '';
  public tableData: any[] = [];

  // reactive API to send/receive search object (complex filters)
  public searchNew$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  // emitted whenever filters are restored for the current route
  public filtersRestored$: BehaviorSubject<TableState | null> =
    new BehaviorSubject<TableState | null>(null);

  // storage for per-route states
  gridSearchHistory: Record<string, TableState> = {};

  // route tracking
  private currentRoute: string = '';
  private routerSub: Subscription;

  // toggle persistence (sessionStorage) — optional
  private readonly useSessionStorage = true;
  private readonly storageKey = 'tableCore.gridSearchHistory';

  constructor(private http: HttpService, private router: Router) {
    // load persisted history if enabled
    if (this.useSessionStorage) {
      this.loadFromSession();
    }

    // initialize currentRoute and subscribe to router events
    this.currentRoute = this.normalizeRoute(this.router.url);

    this.routerSub = this.router.events.subscribe((ev: RouterEvent) => {
      if (ev instanceof NavigationStart) {
        // Save filters for the current route BEFORE navigation happens
        this.saveCurrentPageFilters();
      } else if (ev instanceof NavigationEnd) {
        // Update currentRoute to the new route and restore filters (if any)
        this.currentRoute = this.normalizeRoute(ev.urlAfterRedirects || ev.url);
        this.restorePageFilters(this.currentRoute);
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  // ----------------------
  // Public helper methods
  // ----------------------

  /**
   * Normalize a route for use as a history key (strip query params & hash)
   */
  private normalizeRoute(url: string): string {
    if (!url) return '/';
    const [path] = url.split('?');
    const [clean] = path.split('#');
    return clean || '/';
  }

  /**
   * Save the current page's filter state into memory (and sessionStorage optionally)
   */
  public saveCurrentPageFilters(): void {
    if (!this.currentRoute) return;

    const routeKey = this.currentRoute;
    const state: TableState = {
      isSearchFilter: this.pageOptions.isSearchFilter,
      searchKey: this.pageOptions.searchKey,
      search: this.searchNew$.value,
      pageSize: this.pageOptions.limit,
      pageNumber: this.pageOptions.offset,
      searchCriteria: this.search,
      refId: this.refId || 0,
    };

    this.gridSearchHistory[routeKey] = state;
    if (this.useSessionStorage) {
      sessionStorage.setItem(
        this.storageKey,
        JSON.stringify(this.gridSearchHistory)
      );
    }
  }

  /**
   * Restore filters for the given route (if present)
   * Emits the restored state on filtersRestored$ so components can react.
   */
  public restorePageFilters(route?: string): void {
    const routeKey = this.normalizeRoute(route ?? this.currentRoute);
    const saved = this.gridSearchHistory[routeKey];
    if (!saved) {
      // no saved filters — emit null
      this.filtersRestored$.next(null);
      return;
    }

    this.pageOptions.isSearchFilter = !!saved.isSearchFilter;
    this.pageOptions.searchKey = saved.searchKey ?? '';
    this.pageOptions.limit = saved.pageSize ?? this.pageOptions.limit;
    this.pageOptions.offset = saved.pageNumber ?? this.pageOptions.offset;
    this.search = saved.searchCriteria ?? '';
    this.searchNew$.next(saved.search ?? {});
    this.refId = saved.refId ?? null;

    // push a copy to subscribers
    this.filtersRestored$.next({ ...saved });
  }

  /**
   * Clear saved filters for current route (and reset page options)
   */
  public clearPageFilters(): void {
    if (!this.currentRoute) {
      this.resetPageOptions();
      return;
    }
    delete this.gridSearchHistory[this.currentRoute];
    if (this.useSessionStorage) {
      sessionStorage.setItem(
        this.storageKey,
        JSON.stringify(this.gridSearchHistory)
      );
    }
    this.resetPageOptions();
    this.filtersRestored$.next(null);
  }

  /**
   * Reset page options to defaults (local)
   */
  private resetPageOptions(): void {
    this.pageOptions = {
      count: -1,
      offset: 0,
      limit: 10,
      searchKey: '',
      isSearchFilter: false,
    };
    this.search = '';
    this.searchNew$.next({});
    this.refId = null;
  }

  /**
   * Get the request payload that the backend expects, based on current local state.
   * Note: this does NOT modify history.
   */
  public getRequestObject(): any {
    return {
      isSearchFilter: this.pageOptions.isSearchFilter,
      searchKey: this.pageOptions.searchKey,
      search: this.searchNew$.value,
      pageSize: this.pageOptions.limit,
      pageNumber: this.pageOptions.offset,
      searchCriteria: this.search,
      refId: this.refId || 0,
      merchantId: 0,
      terminalId: 0,
      id: 0,
    };
  }

  /**
   * Fetch grid data from the backend.
   * - Properly merges params with internal refId/id handling.
   * - Does NOT clear the gridSearchHistory (history persists).
   */
  public getAllData(url: string, params?: any): Observable<any> {
    this.tableData = [];
    let options = this.getRequestObject();

    // Merge incoming params carefully:
    // - If caller passed an explicit 'id' or 'refId', respect it.
    // - Otherwise if service has refId and refScope, provide 'id' (common pattern).
    const incoming = params ? { ...params } : {};

    if (incoming.hasOwnProperty('refId')) {
      options.refId = incoming.refId;
    }

    if (incoming.hasOwnProperty('id')) {
      options.id = incoming.id;
    } else if (!incoming.hasOwnProperty('id') && this.refScope && this.refId) {
      // use `id` as the reference in request if service is scoped (keeps API consistent)
      incoming.id = this.refId;
    }

    options = { ...options, ...incoming };

    return this.http.postReq(url, options).pipe(
      take(1),
      map((resp: any) => {
        // return full response so caller UI can handle it
        if (resp && resp.success) {
          this.tableData = Array.isArray(resp.data?.data) ? resp.data.data : [];
          // update paging metadata if present
          if (resp.data) {
            this.pageOptions.count =
              resp.data.listCount ?? this.pageOptions.count;
            this.pageOptions.offset =
              resp.data.pageNumber ?? this.pageOptions.offset;
          }
        }
        return resp;
      })
    );
  }

  // ----------------------
  // CRUD / Utility methods (kept behaviour similar to original)
  // ----------------------

  deleteItem(url: string, id: string): Observable<any> {
    return this.http.deleteReq(url, id).pipe(
      take(1),
      map((resp: any) => resp)
    );
  }

  deleteSelectedItems(url: string, ids: number[]): Observable<any> {
    return this.http.putReq(url, ids).pipe(
      take(1),
      map((resp: any) => resp)
    );
  }

  toggleBlock(
    url: string,
    blockData: BlockItemInterface,
    item?: any
  ): Observable<any> {
    // Flip locally so UI is optimistic; we will revert if backend fails
    const previous = blockData.isBlock;
    blockData.isBlock = !blockData.isBlock;
    return this.http.putReq(url, blockData).pipe(
      take(1),
      map((resp: any) => {
        if (!resp || !resp.success) {
          // revert local change
          blockData.isBlock = previous;
          return resp;
        }
        // backend success: update local table array if item provided
        const foundIndex = this.tableData.findIndex((r) => r === item);
        if (foundIndex > -1) {
          this.tableData[foundIndex] = {
            ...this.tableData[foundIndex],
            isBlock: blockData.isBlock,
          };
          this.tableData = [...this.tableData];
        }
        return resp;
      })
    );
  }

  exportTable(url: string): Observable<any> {
    const options = this.getRequestObject();
    options.id = this.refId ?? options.id;
    return this.http.postReq(url, options).pipe(
      take(1),
      map(({ success, data }) => {
        if (!success) return null;
        // attempt navigation to download link
        window.location.href = data;
        return data;
      })
    );
  }

  pinFilter(filterParams: any): Observable<any> {
    return this.http.postReq('', filterParams);
  }

  unPinFilter(filterParams: any): Observable<any> {
    return this.http.postReq('', filterParams);
  }

  restoreFilters(moduleId: any): Observable<any> {
    return this.http.postReq('', { moduleId });
  }

  import(url: string, data: any): Observable<any> {
    return this.http.postReq(url, data);
  }

  // ----------------------
  // Persistence helpers
  // ----------------------

  private loadFromSession(): void {
    try {
      const raw = sessionStorage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        this.gridSearchHistory = parsed;
      }
    } catch (e) {
      // ignore parse errors
      this.gridSearchHistory = {};
    }
  }
}
