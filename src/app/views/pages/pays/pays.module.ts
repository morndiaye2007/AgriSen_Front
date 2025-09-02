import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaysRoutingModule } from './pays-routing.module';
import { AddPaysComponent } from './add-pays/add-pays.component';
import { ListPaysComponent } from './list-pays/list-pays.component';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ChoixPaysComponent } from './choix-pays/choix-pays.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AddPaysComponent,
    ListPaysComponent,
    ChoixPaysComponent
  ],
  imports: [
    CommonModule,
    PaysRoutingModule,
    MatTableModule,
    NgbPaginationModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgSelectModule,
    MatCheckboxModule
  ],
    exports: [ChoixPaysComponent]

})
export class PaysModule { }
