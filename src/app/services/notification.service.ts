import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {AppNotification} from "../core/models/Notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.baseUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotificationsByUser(userId: number): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.apiUrl}/utilisateur/${userId}`);
  }

  getUnreadNotifications(userId: number): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.apiUrl}/utilisateur/${userId}/non-lues`);
  }

  markAsRead(notificationId: number): Observable<AppNotification> {
    return this.http.patch<AppNotification>(`${this.apiUrl}/${notificationId}/lire`, {});
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/utilisateur/${userId}/lire-tout`, {});
  }

  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${notificationId}`);
  }

  createNotification(notification: AppNotification): Observable<AppNotification> {
    return this.http.post<AppNotification>(this.apiUrl, notification);
  }
}
