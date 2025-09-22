import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { SharedModule } from '../shared/shared.module';
import { MerchanRoutingtModule } from './reports-routing-module';
import { CancellationReportComponent } from './pages/cancellation-report/cancellation-report.component';
import { DeploymentReportComponent } from './pages/deployment-report/deployment-report.component';
import { ReplacementReportComponent } from './pages/replacement-report/replacement-report.component';

@NgModule({
  imports: [CommonModule, MerchanRoutingtModule, SharedModule],
  declarations: [
    ReportsComponent,
    CancellationReportComponent,
    DeploymentReportComponent,
    ReplacementReportComponent,
  ],
})
export class ReportsModule {}
