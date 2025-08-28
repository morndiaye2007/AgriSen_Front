import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPaysComponent } from './list-pays/list-pays.component';

const routes: Routes = [
  { path : '', component : ListPaysComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaysRoutingModule { }
