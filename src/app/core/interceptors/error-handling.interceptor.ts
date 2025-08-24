import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, take, tap } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toaster.service';

@Injectable({
  providedIn: 'root',
})

/**
 * Error Interceptor
 * An Interceptor for handle general errors
 */
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(
    private toaster: ToastService,
    private storage: StorageService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (
              event.url?.includes('assets/i18n') ||
              event.url?.includes('app-config.json') ||
              request.url.includes('geocode.arcgis') ||
              event.url?.includes('Contract/Print') ||
              event.url?.includes('Contract/PrintMainTemplate')
            ) {
              return;
              // TODO: Add Error Handling for not loading the translation files
            }
            // if need to change the responses
            if (
              !event.body.success &&
              event.body.status !== 401 &&
              event.body.status !== 403 &&
              !request.url.includes('lon=')
            ) {
              if (event.body.message)
                this.toaster.showError(event.body.message);
              else if (event.body.status === 403) {
                this.toaster.showWarning(event.body.message);
              } else if (event.body.status === 404)
                this.router.navigate(['/404']);
              else if (event.body.status === 401) this.clearStorage();
              else if (event.body.message)
                this.toaster.showSuccess(event.body.message);
            } else if (
              event.body.message &&
              event.body.status !== 401 &&
              event.body.status !== 403
            ) {
              this.toaster.showSuccess(event.body.message);
            }
          }
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (
              error.url?.includes('assets/i18n') ||
              error.url?.includes('app-config.json') ||
              error.url?.includes('Contract/Print') ||
              error.url?.includes('Contract/PrintMainTemplate')
            ) {
              return;
              // TODO: Add Error Handling for not loading the translation files
            }
            if (error.status === 500)
              this.toaster.showError('Server Error Please Try Again Later');
            else if (error.status === 0)
              this.toaster.showError('Connection Error Please Try Again Later');
            else if (error.status === 401) {
              this.clearStorage();
            } else
              this.toaster.showError('Something Went Wrong Please Try Again');
          }
        }
      )
    );
  }

  clearStorage() {
    this.storage
      .clearStorage()
      .pipe(
        take(1),
        finalize(() => null)
      )
      .subscribe(() => this.router.navigate(['']));
  }
}
