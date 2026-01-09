import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Culture } from '../core/models/Culture';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CultureService {
  private apiUrl = `${environment.apiUrl}/cultures`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les cultures
   */
  getAllCultures(): Observable<Culture[]> {
    return this.http.get<Culture[]>(this.apiUrl);
  }

  /**
   * Récupérer une culture par ID
   */
  getCultureById(id: number): Observable<Culture> {
    return this.http.get<Culture>(`${this.apiUrl}/${id}`);
  }

  /**
   * Créer une nouvelle culture
   */
  createCulture(culture: Culture): Observable<Culture> {
    return this.http.post<Culture>(this.apiUrl, culture);
  }

  /**
   * Mettre à jour une culture
   */
  updateCulture(id: number, culture: Partial<Culture>): Observable<Culture> {
    return this.http.put<Culture>(`${this.apiUrl}/${id}`, culture);
  }

  /**
   * Supprimer une culture
   */
  deleteCulture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Rechercher des cultures
   */
  searchCultures(query: string): Observable<Culture[]> {
    return this.http.get<Culture[]>(`${this.apiUrl}/search?q=${query}`);
  }

  /**
   * Obtenir les cultures par catégorie
   */
  getCulturesByCategorie(categorie: string): Observable<Culture[]> {
    return this.http.get<Culture[]>(`${this.apiUrl}/categorie/${categorie}`);
  }

  /**
   * Obtenir les cultures par saison
   */
  getCulturesBySaison(saison: string): Observable<Culture[]> {
    return this.http.get<Culture[]>(`${this.apiUrl}/saison/${saison}`);
  }
}
