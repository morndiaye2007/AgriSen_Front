import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RapportsRoutingModule } from './rapports-routing.module';
import { RapportsComponent } from './rapports.component';
import { HarvestReportComponent } from './harvest-report/harvest-report.component';
import { FinancialReportComponent } from './financial-report/financial-report.component';
import { ActivityReportComponent } from './activity-report/activity-report.component';
import { ExportReportComponent } from './export-report/export-report.component';


@NgModule({
  declarations: [
    RapportsComponent,
    HarvestReportComponent,
    FinancialReportComponent,
    ActivityReportComponent,
    ExportReportComponent
  ],
  imports: [
    CommonModule,
    RapportsRoutingModule
  ]
})
export class RapportsModule { }
