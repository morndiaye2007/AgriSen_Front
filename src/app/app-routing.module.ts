import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [

  {
    path: '',
    loadChildren: () =>
      import('./views/pages/dashboard/dashboard.module')
        .then(m => m.DashboardModule)
  },

  // Auth (login / register)
  {
    path: 'connexion',
    loadChildren: () =>
      import('./views/pages/auth/auth.module')
        .then(m => m.AuthModule)
  },

  // Pages protégées avec layout
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'pays',
        loadChildren: () =>
          import('./views/pages/pays/pays.module')
            .then(m => m.PaysModule)
      }
    ]
  },

  // /error → Dashboard
  {
    path: 'error',
    redirectTo: '',
    pathMatch: 'full'
  },

  // Toute autre route → Dashboard
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
