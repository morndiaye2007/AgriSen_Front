import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer les notifications d'un utilisateur
   */
  getNotificationsByUser(utilisateurId: number): Observable<Notification[]> {
    const params = new HttpParams().set('utilisateurId', utilisateurId.toString());
    return this.http.get<Notification[]>(this.apiUrl, { params });
  }

  /**
   * Récupérer les notifications non lues
   * MÉTHODE UTILISÉE DANS LE DASHBOARD
   */
  getUnreadNotifications(utilisateurId: number): Observable<Notification[]> {
    const params = new HttpParams()
      .set('utilisateurId', utilisateurId.toString())
      .set('lu', 'false');
    return this.http.get<Notification[]>(this.apiUrl, { params });
  }

  /**
   * Marquer une notification comme lue
   * MÉTHODE UTILISÉE DANS LE DASHBOARD
   */
  markAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}/read`, {});
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead(utilisateurId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/read-all`, { utilisateurId });
  }

  /**
   * Supprimer une notification
   */
  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Créer une notification
   */
  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  getUnreadCount(utilisateurId: number): Observable<number> {
    const params = new HttpParams().set('utilisateurId', utilisateurId.toString());
    return this.http.get<number>(`${this.apiUrl}/unread-count`, { params });
  }
}
