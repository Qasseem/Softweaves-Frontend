import { Component, OnInit } from '@angular/core';
import { AppTranslateService } from './core/shared/services/translate.service';
import { Spinkit } from 'ng-http-loader';
import { StorageService } from './core/services/storage.service';
import { AuthService } from './core/services/auth.service';
import { MsalService } from '@azure/msal-angular';

import { SpinnerVisibilityService } from 'ng-http-loader';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'oc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // this.inactivityService.initialize();
    this.isIframe = window !== window.parent && !window.opener;
  }
  public spinkit = Spinkit;
  loginDisplay = false;
  title = 'My Afaqy Customers';
  isIframe = false;
  constructor(
    private appTranslateService: AppTranslateService,
    private storage: StorageService,
    private authService: AuthService,
    private msalSerivce: MsalService,
    private spinner: SpinnerVisibilityService
  ) {
    if (window.top !== window) {
      window.top.location.href = window.location.href;
    }
    // this.spinner.hide();
    this.getSilentToken();
    this.appTranslateService.changeLangage(this.storage.getLang());
  }

  getMenuItems() {
    this.authService.getMenuItems();
  }

  getSilentToken() {
    this.msalSerivce.instance.initialize().then(() => {
      const tokenRequest = {
        scopes: [...environment.adConfig.scopeUrls],
        account: this.msalSerivce.instance.getAllAccounts()[0],
      };

      this.msalSerivce.instance
        .acquireTokenSilent(tokenRequest)
        .then((response) => {
          // Use the access token
          this.getMenuItems();
        })
        .catch((error) => {
          // Handle token acquisition error
          this.msalSerivce.instance.acquireTokenPopup(tokenRequest);
        });
    });
  }
}
