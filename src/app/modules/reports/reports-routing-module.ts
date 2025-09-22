import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ReplacementReportComponent } from './pages/replacement-report/replacement-report.component';
import { DeploymentReportComponent } from './pages/deployment-report/deployment-report.component';
import { CancellationReportComponent } from './pages/cancellation-report/cancellation-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'replacement',
        component: ReplacementReportComponent,
      },
      {
        path: 'deployment',
        component: DeploymentReportComponent,
      },
      {
        path: 'cancellation',
        component: CancellationReportComponent,
      },
      { path: '', redirectTo: 'main/dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/main/reports', pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchanRoutingtModule {}
