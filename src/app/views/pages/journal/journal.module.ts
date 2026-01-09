import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalRoutingModule } from './journal-routing.module';
import { JournalComponent } from './journal.component';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { EditEntryComponent } from './edit-entry/edit-entry.component';
import { EntryDetailComponent } from './entry-detail/entry-detail.component';
import { EntryCardComponent } from './entry-card/entry-card.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { ListViewComponent } from './list-view/list-view.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';


@NgModule({
  declarations: [
    JournalComponent,
    AddEntryComponent,
    EditEntryComponent,
    EntryDetailComponent,
    EntryCardComponent,
    CalendarViewComponent,
    ListViewComponent,
    FilterPanelComponent
  ],
  imports: [
    CommonModule,
    JournalRoutingModule
  ]
})
export class JournalModule { }
