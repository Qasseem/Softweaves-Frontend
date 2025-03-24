import { RouterModule, Routes } from '@angular/router';
import { MerchantTicktetsComponent } from './merchant-ticktets.component';
import { MerchantTicketsListComponent } from './pages/merchant-tickets-list/merchant-tickets-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantTicketsDetailsComponent } from './pages/merchant-tickets-details/merchant-tickets-details.component';

const routes: Routes = [
  {
    path: '',
    component: MerchantTicktetsComponent,
    children: [
      {
        path: 'list',
        component: MerchantTicketsListComponent,
      },
      {
        path: 'details/:id',
        component: MerchantTicketsDetailsComponent,
      },
    ],
  },
  { path: '', redirectTo: '/main/merchanttickets/list', pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchantTicktetsRoutingtModule {}
