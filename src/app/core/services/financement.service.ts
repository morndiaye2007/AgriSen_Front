import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { DemandeCredit, StatutDemande } from '../models/financement.model';

@Injectable({
  providedIn: 'root'
})
export class FinancementService {
  // Données mockées pour la simulation
  private mockDemandes: DemandeCredit[] = [
    {
      id: '1',
      demandeurId: '1',
      montant: 2000000,
      duree: 12,
      motif: 'Achat d\'équipements agricoles',
      description: 'Besoin de financement pour l\'achat d\'un tracteur',
      statut: StatutDemande.VALIDEE,
      tauxInteret: 5,
      mensualite: 175000,
      dateDemande: new Date('2024-10-01'),
      dateValidation: new Date('2024-10-05')
    },
    {
      id: '2',
      demandeurId: '1',
      montant: 500000,
      duree: 6,
      motif: 'Achat de semences',
      description: 'Financement pour l\'achat de semences pour la prochaine saison',
      statut: StatutDemande.EN_ATTENTE,
      dateDemande: new Date('2024-11-20')
    }
  ];

  getAll(): Observable<DemandeCredit[]> {
    // SIMULATION
    return of([...this.mockDemandes]).pipe(delay(500));
  }

  getById(id: string): Observable<DemandeCredit> {
    // SIMULATION
    const demande = this.mockDemandes.find(d => d.id === id);
    if (demande) {
      return of({ ...demande }).pipe(delay(300));
    }
    return of(this.mockDemandes[0]).pipe(delay(300));
  }

  create(demande: Partial<DemandeCredit>): Observable<DemandeCredit> {
    // SIMULATION
    const tauxInteret = 0.05; // 5%
    const montant = demande.montant || 0;
    const duree = demande.duree || 12;
    const mensualite = (montant * (1 + tauxInteret)) / duree;

    const newDemande: DemandeCredit = {
      id: Date.now().toString(),
      demandeurId: '1',
      montant: demande.montant || 0,
      duree: demande.duree || 12,
      motif: demande.motif || '',
      description: demande.description || '',
      statut: StatutDemande.EN_ATTENTE,
      tauxInteret: tauxInteret,
      mensualite: mensualite,
      dateDemande: new Date(),
      ...demande
    } as DemandeCredit;
    this.mockDemandes.push(newDemande);
    return of(newDemande).pipe(delay(500));
  }
}

