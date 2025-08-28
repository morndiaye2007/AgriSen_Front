import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAgentComponent } from './list-agent/list-agent.component';

const routes: Routes = [
  {path: '', component: ListAgentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
