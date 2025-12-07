import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { JournalRoutingModule } from './journal-routing.module';
import { JournalListComponent } from './journal-list/journal-list.component';
import { JournalFormComponent } from './journal-form/journal-form.component';

@NgModule({
  declarations: [
    JournalListComponent,
    JournalFormComponent
  ],
  imports: [
    SharedModule,
    JournalRoutingModule
  ]
})
export class JournalModule { }

