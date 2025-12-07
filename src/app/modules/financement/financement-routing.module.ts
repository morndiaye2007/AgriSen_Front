import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancementFormComponent } from './financement-form/financement-form.component';
import { FinancementListComponent } from './financement-list/financement-list.component';

const routes: Routes = [
  {
    path: '',
    component: FinancementListComponent
  },
  {
    path: 'new',
    component: FinancementFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancementRoutingModule { }

