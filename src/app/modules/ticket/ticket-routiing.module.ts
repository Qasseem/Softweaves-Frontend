import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketComponent } from './ticket.component';
import { RouterModule, Routes } from '@angular/router';
import { TicketFormComponent } from './pages/ticket-form/ticket-form.component';
import { ViewTicketComponent } from './pages/view-ticket/view-ticket.component';
import { TicketsListComponent } from './pages/tickets-list/tickets-list.component';
import { ScheduledTicketsListComponent } from './pages/scheduled-tickets-list/scheduled-tickets-list.component';
import { ViewScheduledTicketComponent } from './pages/view-scheduled-ticket/view-scheduled-ticket.component';
import { HistoryLogComponent } from '../shared/components/history-log/history-log.component';
import { CompletetTicketComponent } from './pages/completet-ticket/completet-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: TicketComponent,
    children: [
      {
        path: 'add',
        component: TicketFormComponent,
        data: {
          type: 'add',
        },
      },
      {
        path: 'add/:terminalId',
        component: TicketFormComponent,
        data: {
          type: 'add',
        },
      },
      {
        path: 'list',
        component: TicketsListComponent,
      },
      {
        path: 'scheduled',
        component: ScheduledTicketsListComponent,
      },
      {
        path: '',
        component: TicketsListComponent,
      },
      {
        path: 'edit/:id',
        component: TicketFormComponent,
        data: {
          type: 'edit',
        },
      },
      {
        path: 'clone/:id',
        component: TicketFormComponent,
        data: {
          type: 'clone',
        },
      },
      {
        path: 'details/:id',
        component: ViewTicketComponent,
      },
      {
        path: 'history/:id/:type',
        component: HistoryLogComponent,
      },
      {
        path: 'scheduled-details/:id',
        component: ViewScheduledTicketComponent,
      },
      {
        path: 'complete/:id',
        component: CompletetTicketComponent,
      },
      { path: '', redirectTo: '/list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketRoutingModule {}
