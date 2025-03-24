import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomeModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'merchant',
        loadChildren: () =>
          import('../merchant/merchant.module').then((m) => m.MerchantModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'terminal',
        loadChildren: () =>
          import('../terminal/terminal.module').then((m) => m.TerminalModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'ticket',
        loadChildren: () =>
          import('../ticket/ticket.module').then((m) => m.TicketModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('../user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'locations',
        loadChildren: () =>
          import('../locations/locations.module').then(
            (m) => m.LocationsModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'admin-activities',
        loadChildren: () =>
          import('../admin-activities/admin-activities.module').then(
            (m) => m.AdminActivitiesModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'notification-center',
        loadChildren: () =>
          import('../notification-center/notification-center.module').then(
            (m) => m.NotificationCenterModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('../inventory/inventory.module').then(
            (m) => m.InventoryModule
          ),
        // canActivate: [AuthGuard],
      },
      {
        path: 'merchanttickets',
        loadChildren: () =>
          import('../merchant-ticktets/merchant-ticktets.module').then(
            (m) => m.MerchantTicktetsModule
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/main/merchant/list',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
