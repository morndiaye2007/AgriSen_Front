import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CultureRoutingModule } from './culture-routing.module';
import { ListCultureComponent } from './list-culture/list-culture.component';
import { AddCultureComponent } from './add-culture/add-culture.component';
import { EditCultureComponent } from './edit-culture/edit-culture.component';
import { DetailCultureComponent } from './detail-culture/detail-culture.component';
import { CultureCardComponent } from './culture-card/culture-card.component';
import { CultureCalendarComponent } from './culture-calendar/culture-calendar.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ListCultureComponent,
    AddCultureComponent,
    EditCultureComponent,
    DetailCultureComponent,
    CultureCardComponent,
    CultureCalendarComponent
  ],
    imports: [
        CommonModule,
        CultureRoutingModule,
        ReactiveFormsModule
    ]
})
export class CultureModule { }
