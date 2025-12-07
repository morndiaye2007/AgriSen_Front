import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalListComponent } from './journal-list/journal-list.component';
import { JournalFormComponent } from './journal-form/journal-form.component';

const routes: Routes = [
  {
    path: '',
    component: JournalListComponent
  },
  {
    path: 'new',
    component: JournalFormComponent
  },
  {
    path: ':id/edit',
    component: JournalFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalRoutingModule { }

