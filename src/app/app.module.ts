import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { LayoutModule } from './views/layout/layout.module';
import { AuthGuard } from './core/guard/auth.guard';

import { AppComponent } from './app.component';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';

import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { PipeModule } from './util/pipe/pipe.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconModule } from './core/feather-icon/feather-icon.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ChoixPaysComponent } from './views/pages/pays/choix-pays/choix-pays.component';
import { AddAgentComponent } from './views/pages/agent/add-agent/add-agent.component';
import { DashboardComponent } from './views/pages/dashboard/dashboard.component';
import { JournalComponent } from './views/pages/journal/journal.component';
import { ParcellesComponent } from './views/pages/parcelles/parcelles.component';
import { NotFoundComponent } from './views/pages/error/not-found/not-found.component';
import { UnauthorizedComponent } from './views/pages/error/unauthorized/unauthorized.component';
import { ServerErrorComponent } from './views/pages/error/server-error/server-error.component';


@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    DashboardComponent,
    JournalComponent,
    ParcellesComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    ServerErrorComponent,
    // ChoixPaysComponent,
    // AddAgentComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    NgbModule,
    ReactiveFormsModule,
    FeatherIconModule,
    HttpClientModule,
    PipeModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HIGHLIGHT_OPTIONS, // https://www.npmjs.com/package/ngx-highlightjs
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
