import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { JournalActivite, TypeActivite } from '../models/journal.model';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  // Données mockées pour la simulation
  private mockActivites: JournalActivite[] = [
    {
      id: '1',
      parcelleId: '1',
      type: TypeActivite.PLANTATION,
      date: new Date('2024-06-15'),
      description: 'Plantation de Mil - Variété Souna 3',
      cout: 50000,
      quantite: 50,
      unite: 'kg',
      observations: 'Conditions météorologiques favorables',
      createdAt: new Date('2024-06-15'),
      updatedAt: new Date('2024-06-15')
    },
    {
      id: '2',
      parcelleId: '2',
      type: TypeActivite.IRRIGATION,
      date: new Date('2024-07-10'),
      description: 'Irrigation de la parcelle B',
      cout: 15000,
      quantite: 2000,
      unite: 'litres',
      observations: 'Humidité du sol optimale après irrigation',
      createdAt: new Date('2024-07-10'),
      updatedAt: new Date('2024-07-10')
    },
    {
      id: '3',
      parcelleId: '1',
      type: TypeActivite.FERTILISATION,
      date: new Date('2024-07-20'),
      description: 'Application d\'engrais NPK',
      cout: 75000,
      quantite: 100,
      unite: 'kg',
      observations: 'Engrais appliqué uniformément',
      createdAt: new Date('2024-07-20'),
      updatedAt: new Date('2024-07-20')
    },
    {
      id: '4',
      parcelleId: '3',
      type: TypeActivite.TRAITEMENT,
      date: new Date('2024-08-05'),
      description: 'Traitement contre les nuisibles',
      cout: 30000,
      quantite: 5,
      unite: 'litres',
      observations: 'Traitement préventif effectué',
      createdAt: new Date('2024-08-05'),
      updatedAt: new Date('2024-08-05')
    }
  ];

  getAll(): Observable<JournalActivite[]> {
    // SIMULATION
    return of([...this.mockActivites]).pipe(delay(500));
  }

  getByParcelle(parcelleId: string): Observable<JournalActivite[]> {
    // SIMULATION
    const activites = this.mockActivites.filter(a => a.parcelleId === parcelleId);
    return of(activites).pipe(delay(300));
  }

  create(activite: Partial<JournalActivite>): Observable<JournalActivite> {
    // SIMULATION
    const newActivite: JournalActivite = {
      id: Date.now().toString(),
      parcelleId: activite.parcelleId || '1',
      type: activite.type || TypeActivite.AUTRE,
      date: activite.date || new Date(),
      description: activite.description || '',
      cout: activite.cout || 0,
      quantite: activite.quantite,
      unite: activite.unite,
      observations: activite.observations,
      createdAt: new Date(),
      updatedAt: new Date()
    } as JournalActivite;
    this.mockActivites.push(newActivite);
    return of(newActivite).pipe(delay(500));
  }

  update(id: string, activite: Partial<JournalActivite>): Observable<JournalActivite> {
    // SIMULATION
    const index = this.mockActivites.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockActivites[index] = { ...this.mockActivites[index], ...activite, updatedAt: new Date() } as JournalActivite;
      return of(this.mockActivites[index]).pipe(delay(500));
    }
    return of(this.mockActivites[0]).pipe(delay(500));
  }

  delete(id: string): Observable<void> {
    // SIMULATION
    const index = this.mockActivites.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockActivites.splice(index, 1);
    }
    return of(undefined).pipe(delay(300));
  }
}

