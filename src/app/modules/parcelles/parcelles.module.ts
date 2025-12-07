import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ParcellesRoutingModule } from './parcelles-routing.module';
import { ParcellesListComponent } from './parcelles-list/parcelles-list.component';
import { ParcelleFormComponent } from './parcelle-form/parcelle-form.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    ParcellesListComponent,
    ParcelleFormComponent
  ],
  imports: [
    SharedModule,
    ParcellesRoutingModule,
    LeafletModule
  ]
})
export class ParcellesModule { }

