import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'parcelles',
        loadChildren: () => import('../parcelles/parcelles.module').then(m => m.ParcellesModule)
      },
      {
        path: 'journal',
        loadChildren: () => import('../journal/journal.module').then(m => m.JournalModule)
      },
      {
        path: 'marketplace',
        loadChildren: () => import('../marketplace/marketplace.module').then(m => m.MarketplaceModule)
      },
      {
        path: 'financement',
        loadChildren: () => import('../financement/financement.module').then(m => m.FinancementModule)
      },
      {
        path: 'profil',
        loadChildren: () => import('../profil/profil.module').then(m => m.ProfilModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

