import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StorageService } from '../services/storage.service';
@Injectable({
  providedIn: 'root',
})

/**
 * Token Interceptor
 * An Interceptor for add auth token to the header of each http
 */
export class TokenInterceptor implements HttpInterceptor {
  private token: any;
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const storage = inject(StorageService);
    let headerWithToken;
    if (request.url.includes('geocode.arcgis')) {
      return next.handle(request);
    } else if (
      request.url.endsWith('UploadFile') ||
      request.url.includes('ImportMerchants') ||
      request.url.includes('ImportTerminals') ||
      request.url.includes('ImportTickets') ||
      request.url.includes('ImportMerchantCategory') ||
      request.url.includes('ImportErrandType') ||
      request.url.includes('ImportErrandChannel') ||
      request.url.includes('ImportPOSType') ||
      request.url.includes('import') ||
      request.url.includes('Import')
    ) {
      this.token = localStorage.getItem('token');
      headerWithToken = {
        Authorization: 'Bearer ' + this.token,
      };
    } else {
      this.token = localStorage.getItem('token');
      headerWithToken = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token,
        lang: localStorage.getItem('lang') !== 'en' ? 'ar' : 'en',
      };
    }
    headerWithToken = {
      ...headerWithToken,
      'X-Timezone-Offset': String(new Date().getTimezoneOffset()),
      lang: localStorage.getItem('lang') !== 'en' ? 'ar' : 'en',
    };
    const headerWithoutToken = {
      'Content-Type': 'application/json',
    };
    const headerReq =
      request.url.search('http://ic.afaqy.com/api/ApiEmployeeView/get') === 0
        ? headerWithoutToken
        : headerWithToken;

    request = request.clone({
      setHeaders: headerReq,
    });
    let cachedData = storage.getCachedItem(request.url);
    if (cachedData) {
      return of(new HttpResponse({ body: cachedData, status: 200 }));
    }
    return next.handle(request);
  }
}
