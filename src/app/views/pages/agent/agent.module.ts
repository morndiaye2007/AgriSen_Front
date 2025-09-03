import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentRoutingModule } from './agent-routing.module';
import { ListAgentComponent } from './list-agent/list-agent.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatTableModule } from '@angular/material/table'; 
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AddAgentComponent } from './add-agent/add-agent.component';
import { EditAgentComponent } from './edit-agent/edit-agent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaysModule } from '../pays/pays.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    ListAgentComponent,
    AddAgentComponent,
    EditAgentComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    AgentRoutingModule,
    MatSelectModule,
    NgbModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgSelectModule,
    PaysModule,
    MatSortModule,
    DragDropModule
  ]
})
export class AgentModule { }
