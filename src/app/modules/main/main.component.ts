import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, take } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { AppTranslateService } from 'src/app/core/shared/services/translate.service';

@Component({
  selector: 'oc-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  sidebarVisible = true;
  items = [
    {
      label: this.translateService.instant('Dashboard'),
      icon: 'dashboard',
      expanded: false,
      routerLink: '/main/dashboard',
      active: false,
      permission: [],
    },
    {
      label: this.translateService.instant('Merchants'),
      icon: 'merchants',
      expanded: false,
      routerLink: '/main/merchant/list',
      permission: [
        'merchants-all-merchants-view',
        'merchants-favorite-merchants-view',
      ],
      active: false,
      childs: [
        {
          label: this.translateService.instant('All Merchants'),
          expanded: true,
          routerLink: '/main/merchant/list',
          permission: ['merchants-all-merchants-view'],
          active: false,
        },
        {
          label: this.translateService.instant('Favorite Merchants'),
          expanded: true,
          routerLink: '/main/merchant/favorites',
          permission: ['merchants-favorite-merchants-view'],
          active: false,
        },
      ],
    },
    {
      label: this.translateService.instant('Terminals'),
      icon: 'terminals',
      expanded: false,
      routerLink: '/main/terminal/list',
      active: false,
      permission: [
        'terminals-all-terminals-view',
        'terminals-favorite-terminals-view',
      ],

      childs: [
        {
          label: this.translateService.instant('All Terminals'),
          expanded: true,
          routerLink: '/main/terminal/list',
          active: false,
          permission: ['terminals-all-terminals-view'],
        },
        {
          label: this.translateService.instant('Favorite Terminals'),
          expanded: true,
          routerLink: '/main/terminal/favorites',
          active: false,
          permission: ['terminals-favorite-terminals-view'],
        },
      ],
    },
    {
      label: this.translateService.instant('Tickets'),
      icon: 'tickets',
      expanded: false,
      routerLink: '/main/ticket/list',
      active: false,
      permission: ['tickets-all-tickets-view'],
      childs: [
        {
          label: this.translateService.instant('All Tickets'),
          expanded: true,
          routerLink: '/main/ticket/list',
          active: false,
          permission: ['tickets-all-tickets-view'],
        },
        {
          label: this.translateService.instant('Scheduled Tickets'),
          expanded: true,
          routerLink: '/main/ticket/scheduled',
          active: false,
          permission: [],
        },
      ],
    },
    {
      label: this.translateService.instant('Merchant Tickets'),
      icon: 'merchanttickets',
      expanded: false,
      routerLink: '/main/merchanttickets/list',
      active: false,
      permission: ['tickets-merchant-tickets-view'],
      // childs: [
      //   {
      //     label: this.translateService.instant('All Tickets'),
      //     expanded: true,
      //     routerLink: '/main/ticket/list',
      //     active: false,
      //     permission: ['tickets-all-tickets-view'],
      //   },

      // ],
    },
    {
      label: this.translateService.instant('Inventory'),
      icon: 'inventory',
      expanded: false,
      routerLink: '/main/inventory/list',
      active: false,
      permission: [
        'inventory-devices-view',
        'inventory-items-without-serial-view',
        'inventory-model-types-view',
        'inventory-shipments-view',
        'inventory-sim-cards-view',
        'inventory-transfer-custody-view',
        'inventory-warehouses-view',
      ],
      childs: [
        {
          label: this.translateService.instant('Devices'),
          expanded: true,
          routerLink: '/main/inventory/devices/list',
          active: false,
          permission: ['inventory-devices-view'],
        },
        {
          label: this.translateService.instant('Items Without Serial'),
          expanded: true,
          routerLink: '/main/inventory/itemswithoutserial/list',
          active: false,
          permission: ['inventory-items-without-serial-view'],
        },
        {
          label: this.translateService.instant('Sim Cards'),
          expanded: true,
          routerLink: '/main/inventory/simcards/list',
          active: false,
          permission: ['inventory-sim-cards-view'],
        },
        {
          label: this.translateService.instant('Warehouses'),
          expanded: true,
          routerLink: '/main/inventory/warehouses/list',
          active: false,
          permission: ['inventory-warehouses-view'],
        },
        {
          label: this.translateService.instant('Model Types'),
          expanded: true,
          routerLink: '/main/inventory/modeltypes/list',
          active: false,
          permission: ['inventory-model-types-view'],
        },
        {
          label: this.translateService.instant('Shipments'),
          expanded: true,
          routerLink: '/main/inventory/shipments/list',
          active: false,
          permission: ['inventory-shipments-view'],
        },
        {
          label: this.translateService.instant('Transfer Custody'),
          expanded: true,
          routerLink: '/main/inventory/transfercustody/list',
          active: false,
          permission: ['inventory-transfer-custody-view'],
        },
      ],
    },
    {
      label: this.translateService.instant('Reports'),
      icon: 'feedbacks-empty',
      expanded: false,
      routerLink: '/main/reports',
      active: false,
      permission: [
        'reports-deployment-report-view',
        'reports-replacement-report-view',
        'reports-cancellation-report-view',
      ],
      childs: [
        {
          label: this.translateService.instant('Deployed Report'),
          expanded: true,
          routerLink: '/main/reports/deployment',
          active: false,
          permission: ['reports-deployment-report-view'],
        },
        {
          label: this.translateService.instant('Replacement Report'),
          expanded: true,
          routerLink: '/main/reports/replacement',
          active: false,
          permission: ['reports-replacement-report-view'],
        },
        {
          label: this.translateService.instant('Cancellation Report'),
          expanded: true,
          routerLink: '/main/reports/cancellation',
          active: false,
          permission: ['reports-cancellation-report-view'],
        },
      ],
    },

    {
      label: this.translateService.instant('User Management'),
      icon: 'users-management',
      expanded: false,
      routerLink: '/main/user-management/list',
      active: false,
      permission: [
        'users-and-permissions-roles-view',
        'users-and-permissions-users-view',
      ],
      childs: [
        {
          label: this.translateService.instant('Users'),
          expanded: true,
          routerLink: '/main/user-management/user/list',
          active: false,
          permission: ['users-and-permissions-users-view'],
        },
        {
          label: this.translateService.instant('Roles & Permissions'),
          expanded: true,
          routerLink: '/main/user-management/role/list',
          active: false,
          permission: ['users-and-permissions-roles-view'],
        },
      ],
    },
    {
      label: this.translateService.instant('Locations'),
      icon: 'locations',
      expanded: false,
      routerLink: '/main/locations/list',
      active: false,
      permission: [
        'locations-cities-view',
        'locations-regions-view',
        'locations-zones-view',
      ],
      childs: [
        {
          label: this.translateService.instant('Region'),
          expanded: true,
          routerLink: '/main/locations/region/list',
          active: false,
          permission: ['locations-regions-view'],
        },
        {
          label: this.translateService.instant('City'),
          expanded: true,
          routerLink: '/main/locations/city/list',
          active: false,
          permission: ['locations-cities-view'],
        },
        {
          label: this.translateService.instant('Zone'),
          expanded: true,
          routerLink: '/main/locations/zone/list',
          active: false,
          permission: ['locations-zones-view'],
        },
      ],
    },

    {
      label: this.translateService.instant('Admin Activities'),
      icon: 'admin-activities',
      expanded: false,
      routerLink: '/main/admin-activities/list',
      active: false,
      permission: [
        'admin-activities-errand-channel-view',
        'admin-activities-errand-types-view',
        'admin-activities-merchant-category-view',
        'admin-activities-pos-type-view',
      ],
      childs: [
        {
          label: this.translateService.instant('Merchant Category Codes'),
          expanded: true,
          routerLink: '/main/admin-activities/list/merchant-category-codes',
          active: false,
          permission: ['admin-activities-merchant-category-view'],
        },
        {
          label: this.translateService.instant('Errand Channels'),
          expanded: true,
          routerLink: '/main/admin-activities/list/errands-channels',
          active: false,
          permission: ['admin-activities-errand-channel-view'],
        },
        {
          label: this.translateService.instant('POS Types'),
          expanded: true,
          routerLink: '/main/admin-activities/list/pos-types',
          active: false,
          permission: ['admin-activities-pos-type-view'],
        },
        {
          label: this.translateService.instant('Categories Errand Types'),
          expanded: true,
          routerLink: '/main/admin-activities/list/categories-errands-types',
          active: false,
          permission: ['admin-activities-errand-types-view'],
        },
      ],
    },
    {
      label: this.translateService.instant('Notification Center'),
      icon: 'notification',
      expanded: false,
      routerLink: '/main/notification-center/list',
      active: false,
      permission: ['notification-notification-view'],
    },
  ];

  listActions = [
    {
      label: 'Log-out',
      icon: 'pi pi-sign-out',
      command: () => {
        this.logOut();
      },
    },
  ];

  moduleHeader: string;
  userType: any;
  userName: any;
  userImage: any;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private router: Router,
    public storage: StorageService,
    private appTranslateService: AppTranslateService,
    private loading: NgxSpinnerService,
    private msalSerivce: MsalService
  ) {
    this.translateService.setDefaultLang(this.storage.getLang());
    this.translateService.use(this.storage.getLang());
    this.router.events.subscribe({
      next: (route) => {
        if (route instanceof NavigationEnd) {
          const url = route.url.split('/');
          let parentUrl = '';
          if (url[2] && url[2].includes('list')) {
            parentUrl = '/' + url[1] + '/' + url[2] + '/' + url[3];
          } else {
            parentUrl = '/' + url[1] + '/' + url[2];
          }
          const parentItemIndex = this.items.findIndex((x) =>
            x.routerLink.includes(parentUrl)
          );
          if (parentItemIndex > -1) {
            this.items.forEach((item, index) => {
              if (index == parentItemIndex) {
                item.active = true;
                item.expanded = true;
              } else {
                item.active = false;
                item.expanded = false;
              }
            });
            const childItemIndex = this.items[
              parentItemIndex
            ]?.childs?.findIndex((y) => y.routerLink == route.url);
            if (childItemIndex > -1) {
              this.items[parentItemIndex]?.childs?.forEach((x) => {
                if (x.routerLink == route.url) {
                  x.active = true;
                } else {
                  x.active = false;
                }
              });
            }
          }
        }
      },
    });
  }

  ngOnDestroy(): void {}

  changeLangage(lang: string) {
    location.reload();
    this.appTranslateService.changeLangage(lang);
    this.storage.setItem('lang', lang);
  }

  clickItem(event) {
    // this.items.push(event.item);
  }

  ngOnInit() {
    this.userName = this.storage.getStringItem('userNameEn');
    this.userType = this.storage.getStringItem('userType');
    this.userImage = this.storage.getStringItem('userImage');
  }
  panelExpanded(event, currentIndex) {
    this.items.forEach((item, index) => {
      if (currentIndex != index) {
        item.expanded = false;
      } else {
        item.expanded = true;
      }
    });
  }

  setActiveItem(ss) {}

  navigate(item, child = null) {
    if (child == null && !item.childs?.length) {
      this.navigateFromParent(item);
    }
    if (child != null) {
      this.setAllPropsByNameInArray(this.items, 'active', false);
      item.active = true;
      child.active = true;
      this.router.navigate([child.routerLink]);
    }
  }
  navigateFromParent(item) {
    this.setAllPropsByNameInArray(this.items, 'active', false);
    item.active = true;
    this.router.navigate([item.routerLink]);
  }

  logOut(): void {
    // this.loading.show();
    // this.msalSerivce.logout();
    // this.storage
    //   .clearStorage()
    //   .pipe(
    //     take(1),
    //     finalize(() => this.loading.hide())
    //   )
    //   .subscribe(() => this.router.navigate(['/auth/login']));

    this.authService.logOut();
  }
  setAllPropsByNameInArray(arr, propName, value) {
    arr.forEach((obj) => {
      for (const key in obj) {
        if (key === propName) {
          obj[key] = value;
        } else if (typeof obj[key] === 'object') {
          this.setAllPropsByNameInArray(obj[key], propName, value);
        }
      }
    });
  }
}
