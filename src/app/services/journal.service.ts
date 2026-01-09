import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JournalEntry } from '../core/models/JournalEntry';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = `${environment.apiUrl}/journal`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les entrées du journal
   * MÉTHODE UTILISÉE DANS LE DASHBOARD
   */
  getAllEntries(): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(this.apiUrl);
  }

  /**
   * Récupérer une entrée par ID
   */
  getEntryById(id: number): Observable<JournalEntry> {
    return this.http.get<JournalEntry>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupérer les entrées d'une parcelle
   */
  getEntriesByParcelle(parcelleId: number): Observable<JournalEntry[]> {
    const params = new HttpParams().set('parcelleId', parcelleId.toString());
    return this.http.get<JournalEntry[]>(this.apiUrl, { params });
  }

  /**
   * Créer une nouvelle entrée
   */
  createEntry(entry: JournalEntry): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(this.apiUrl, entry);
  }

  /**
   * Mettre à jour une entrée
   */
  updateEntry(id: number, entry: Partial<JournalEntry>): Observable<JournalEntry> {
    return this.http.put<JournalEntry>(`${this.apiUrl}/${id}`, entry);
  }

  /**
   * Supprimer une entrée
   */
  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Filtrer les entrées
   */
  filterEntries(filters: any): Observable<JournalEntry[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<JournalEntry[]>(`${this.apiUrl}/filter`, { params });
  }

  /**
   * Obtenir les statistiques du journal
   */
  getJournalStats(agriculteurId: number): Observable<any> {
    const params = new HttpParams().set('agriculteurId', agriculteurId.toString());
    return this.http.get<any>(`${this.apiUrl}/stats`, { params });
  }
}
