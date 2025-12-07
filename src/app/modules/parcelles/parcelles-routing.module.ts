import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParcellesListComponent } from './parcelles-list/parcelles-list.component';
import { ParcelleFormComponent } from './parcelle-form/parcelle-form.component';

const routes: Routes = [
  {
    path: '',
    component: ParcellesListComponent
  },
  {
    path: 'new',
    component: ParcelleFormComponent
  },
  {
    path: ':id',
    component: ParcelleFormComponent
  },
  {
    path: ':id/edit',
    component: ParcelleFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParcellesRoutingModule { }

