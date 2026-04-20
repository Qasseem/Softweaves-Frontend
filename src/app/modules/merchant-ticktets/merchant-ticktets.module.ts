import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantTicktetsComponent } from './merchant-ticktets.component';
import { MerchantTicktetsRoutingtModule } from './merchant-tickets-routing-module';
import { MerchantTicketsListComponent } from './pages/merchant-tickets-list/merchant-tickets-list.component';
import { FileUploadModule } from 'src/app/core/shared/core/modules/table/components/file-upload/file-upload.module';
import { SharedModule } from '../shared/shared.module';
import { MerchantTicketsDetailsComponent } from './pages/merchant-tickets-details/merchant-tickets-details.component';
import { MerchantTicketHistoryComponent } from './pages/merchant-ticket-history/merchant-ticket-history.component';

@NgModule({
  imports: [
    CommonModule,
    MerchantTicktetsRoutingtModule,
    SharedModule,
    FileUploadModule,
  ],
  declarations: [
    MerchantTicktetsComponent,
    MerchantTicketsListComponent,
    MerchantTicketsDetailsComponent,
    MerchantTicketHistoryComponent,
  ],
})
export class MerchantTicktetsModule {}
