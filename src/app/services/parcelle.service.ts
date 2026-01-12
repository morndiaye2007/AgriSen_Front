import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {Parcelle} from "../core/models/Parcelle";

@Injectable({
  providedIn: 'root'
})
export class ParcelleService {
  private apiUrl = `${environment.baseUrl}/parcelles`;

  constructor(private http: HttpClient) {}

  getAllParcelles(): Observable<Parcelle[]> {
    return this.http.get<Parcelle[]>(this.apiUrl);
  }

  getParcelleById(id: number): Observable<Parcelle> {
    return this.http.get<Parcelle>(`${this.apiUrl}/${id}`);
  }

  getParcellesByAgriculteur(agriculteurId: number): Observable<Parcelle[]> {
    return this.http.get<Parcelle[]>(`${this.apiUrl}/agriculteur/${agriculteurId}`);
  }

  getParcellesActives(): Observable<Parcelle[]> {
    return this.http.get<Parcelle[]>(`${this.apiUrl}/actives`);
  }

  getParcellesByCulture(cultureId: number): Observable<Parcelle[]> {
    return this.http.get<Parcelle[]>(`${this.apiUrl}/culture/${cultureId}`);
  }

  createParcelle(parcelle: Parcelle): Observable<Parcelle> {
    return this.http.post<Parcelle>(this.apiUrl, parcelle);
  }

  updateParcelle(id: number, parcelle: Parcelle): Observable<Parcelle> {
    return this.http.put<Parcelle>(`${this.apiUrl}/${id}`, parcelle);
  }

  deleteParcelle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activerParcelle(id: number): Observable<Parcelle> {
    return this.http.patch<Parcelle>(`${this.apiUrl}/${id}/activer`, {});
  }

  desactiverParcelle(id: number): Observable<Parcelle> {
    return this.http.patch<Parcelle>(`${this.apiUrl}/${id}/desactiver`, {});
  }
}
