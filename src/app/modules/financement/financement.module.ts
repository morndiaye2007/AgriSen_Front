import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FinancementRoutingModule } from './financement-routing.module';
import { FinancementFormComponent } from './financement-form/financement-form.component';
import { FinancementListComponent } from './financement-list/financement-list.component';

@NgModule({
  declarations: [
    FinancementFormComponent,
    FinancementListComponent
  ],
  imports: [
    SharedModule,
    FinancementRoutingModule
  ]
})
export class FinancementModule { }

