import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meteo } from '../core/models/Meteo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {
  private apiUrl = `${environment.apiUrl}/meteo`;

  constructor(private http: HttpClient) {}

  /**
   * Obtenir la météo actuelle
   * MÉTHODE UTILISÉE DANS LE DASHBOARD
   */
  getCurrentMeteo(latitude: number, longitude: number): Observable<Meteo> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());
    return this.http.get<Meteo>(`${this.apiUrl}/current`, { params });
  }

  /**
   * Obtenir les prévisions météo
   * MÉTHODE UTILISÉE DANS LE DASHBOARD
   */
  getForecast(latitude: number, longitude: number, days: number = 7): Observable<Meteo[]> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('days', days.toString());
    return this.http.get<Meteo[]>(`${this.apiUrl}/forecast`, { params });
  }

  /**
   * Obtenir la météo par ville
   */
  getMeteoByVille(ville: string): Observable<Meteo> {
    return this.http.get<Meteo>(`${this.apiUrl}/ville/${ville}`);
  }

  /**
   * Obtenir l'historique météo
   */
  getMeteoHistory(latitude: number, longitude: number, startDate: Date, endDate: Date): Observable<Meteo[]> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    return this.http.get<Meteo[]>(`${this.apiUrl}/history`, { params });
  }

  /**
   * Obtenir les alertes météo
   */
  getAlerts(latitude: number, longitude: number): Observable<any[]> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());
    return this.http.get<any[]>(`${this.apiUrl}/alerts`, { params });
  }
}


