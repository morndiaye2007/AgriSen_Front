import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcelle } from '../core/models/Parcelle';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParcelleService {
  private apiUrl = `${environment.apiUrl}/parcelles`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les parcelles
   */
  getAllParcelles(): Observable<Parcelle[]> {
    return this.http.get<Parcelle[]>(this.apiUrl);
  }

  /**
   * Récupérer une parcelle par ID
   */
  getParcelleById(id: number): Observable<Parcelle> {
    return this.http.get<Parcelle>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupérer les parcelles d'un agriculteur
   * MÉTHODE UTILISÉE DANS LE DASHBOARD
   */
  getParcellesByAgriculteur(agriculteurId: number): Observable<Parcelle[]> {
    const params = new HttpParams().set('agriculteurId', agriculteurId.toString());
    return this.http.get<Parcelle[]>(this.apiUrl, { params });
  }

  /**
   * Créer une nouvelle parcelle
   */
  createParcelle(parcelle: Parcelle): Observable<Parcelle> {
    return this.http.post<Parcelle>(this.apiUrl, parcelle);
  }

  /**
   * Mettre à jour une parcelle
   */
  updateParcelle(id: number, parcelle: Partial<Parcelle>): Observable<Parcelle> {
    return this.http.put<Parcelle>(`${this.apiUrl}/${id}`, parcelle);
  }

  /**
   * Supprimer une parcelle
   */
  deleteParcelle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Rechercher des parcelles avec filtres
   */
  searchParcelles(filters: {
    nom?: string;
    ville?: string;
    cultureId?: number;
    active?: boolean;
  }): Observable<Parcelle[]> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<Parcelle[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Activer/Désactiver une parcelle
   */
  toggleParcelleStatus(id: number, active: boolean): Observable<Parcelle> {
    return this.http.patch<Parcelle>(`${this.apiUrl}/${id}/status`, { active });
  }

  /**
   * Obtenir les statistiques d'une parcelle
   */
  getParcelleStats(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/stats`);
  }

  /**
   * Obtenir les parcelles à proximité d'une position
   */
  getParcellesNearby(latitude: number, longitude: number, radius: number = 10): Observable<Parcelle[]> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('radius', radius.toString());

    return this.http.get<Parcelle[]>(`${this.apiUrl}/nearby`, { params });
  }

  /**
   * Obtenir l'historique d'une parcelle
   */
  getParcelleHistory(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/history`);
  }

  /**
   * Exporter les parcelles en CSV
   */
  exportParcellesCSV(agriculteurId: number): Observable<Blob> {
    const params = new HttpParams().set('agriculteurId', agriculteurId.toString());
    return this.http.get(`${this.apiUrl}/export/csv`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Exporter les parcelles en PDF
   */
  exportParcellesPDF(agriculteurId: number): Observable<Blob> {
    const params = new HttpParams().set('agriculteurId', agriculteurId.toString());
    return this.http.get(`${this.apiUrl}/export/pdf`, {
      params,
      responseType: 'blob'
    });
  }
}
