import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    MainLayoutComponent,
    DashboardComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    NgChartsModule
  ]
})
export class DashboardModule { }

