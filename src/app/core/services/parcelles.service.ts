import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiService } from './api.service';
import { Parcelle, Culture } from '../models/parcelle.model';

@Injectable({
  providedIn: 'root'
})
export class ParcellesService {
  // Données mockées pour la simulation
  private mockParcelles: Parcelle[] = [
    {
      id: '1',
      nom: 'Champ A - Route Baobab',
      taille: 2.5,
      coordonneesGPS: { latitude: 14.7167, longitude: -17.4677 },
      cultureActuelle: {
        id: '1',
        type: 'Mil',
        variete: 'Souna 3',
        datePlantation: new Date('2024-06-15'),
        dateRecolteEstimee: new Date('2024-10-25'),
        parcelleId: '1'
      },
      proprietaireId: '1',
      region: 'Dakar',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-15')
    },
    {
      id: '2',
      nom: 'Parcelle B - Près du fleuve',
      taille: 1.8,
      coordonneesGPS: { latitude: 14.7348, longitude: -17.4549 },
      cultureActuelle: {
        id: '2',
        type: 'Arachides',
        variete: 'Fleur 11',
        datePlantation: new Date('2024-06-15'),
        dateRecolteEstimee: new Date('2024-10-25'),
        parcelleId: '2'
      },
      proprietaireId: '1',
      region: 'Thiès',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-06-15')
    },
    {
      id: '3',
      nom: 'Champ C - Zone Nord',
      taille: 3.2,
      coordonneesGPS: { latitude: 14.7500, longitude: -17.4500 },
      cultureActuelle: {
        id: '3',
        type: 'Sorgho',
        variete: 'CE 151',
        datePlantation: new Date('2024-07-01'),
        dateRecolteEstimee: new Date('2024-11-15'),
        parcelleId: '3'
      },
      proprietaireId: '1',
      region: 'Louga',
      createdAt: new Date('2024-03-20'),
      updatedAt: new Date('2024-07-01')
    },
    {
      id: '4',
      nom: 'Parcelle D - Zone Sud',
      taille: 1.5,
      coordonneesGPS: { latitude: 14.7000, longitude: -17.4800 },
      cultureActuelle: {
        id: '4',
        type: 'Niébé',
        variete: 'IT 90',
        datePlantation: new Date('2024-06-20'),
        dateRecolteEstimee: new Date('2024-09-30'),
        parcelleId: '4'
      },
      proprietaireId: '1',
      region: 'Dakar',
      createdAt: new Date('2024-04-05'),
      updatedAt: new Date('2024-06-20')
    }
  ];

  constructor(private apiService: ApiService) {}

  getAll(): Observable<Parcelle[]> {
    // SIMULATION - À remplacer par l'appel HTTP réel quand le backend sera prêt
    // return this.apiService.get<Parcelle[]>('/parcelles');
    return of([...this.mockParcelles]).pipe(delay(500));
  }

  getById(id: string): Observable<Parcelle> {
    // SIMULATION
    // return this.apiService.get<Parcelle>(`/parcelles/${id}`);
    const parcelle = this.mockParcelles.find(p => p.id === id);
    if (parcelle) {
      return of({ ...parcelle }).pipe(delay(300));
    }
    return of(this.mockParcelles[0]).pipe(delay(300));
  }

  create(parcelle: Partial<Parcelle>): Observable<Parcelle> {
    // SIMULATION
    // return this.apiService.post<Parcelle>('/parcelles', parcelle);
    const newParcelle: Parcelle = {
      id: Date.now().toString(),
      nom: parcelle.nom || 'Nouvelle Parcelle',
      taille: parcelle.taille || 0,
      coordonneesGPS: parcelle.coordonneesGPS || { latitude: 14.7167, longitude: -17.4677 },
      proprietaireId: '1',
      region: parcelle.region || 'Dakar',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...parcelle
    } as Parcelle;
    this.mockParcelles.push(newParcelle);
    return of(newParcelle).pipe(delay(500));
  }

  update(id: string, parcelle: Partial<Parcelle>): Observable<Parcelle> {
    // SIMULATION
    // return this.apiService.put<Parcelle>(`/parcelles/${id}`, parcelle);
    const index = this.mockParcelles.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockParcelles[index] = { ...this.mockParcelles[index], ...parcelle, updatedAt: new Date() } as Parcelle;
      return of(this.mockParcelles[index]).pipe(delay(500));
    }
    return of(this.mockParcelles[0]).pipe(delay(500));
  }

  delete(id: string): Observable<void> {
    // SIMULATION
    // return this.apiService.delete<void>(`/parcelles/${id}`);
    const index = this.mockParcelles.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockParcelles.splice(index, 1);
    }
    return of(undefined).pipe(delay(300));
  }
}

