import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { NotificationBadgeComponent } from './notification-badge/notification-badge.component';


@NgModule({
  declarations: [
    NotificationComponent,
    NotificationListComponent,
    NotificationItemComponent,
    NotificationSettingsComponent,
    NotificationBadgeComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule
  ]
})
export class NotificationModule { }
