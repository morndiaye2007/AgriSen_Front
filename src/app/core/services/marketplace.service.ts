import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Produit, Commande, StatutCommande, CategorieProduit } from '../models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  // Données mockées pour la simulation
  private mockProduits: Produit[] = [
    {
      id: '1',
      nom: 'Mangue Kent',
      description: 'Mangues fraîches de qualité supérieure',
      prix: 5000,
      unite: 'Caisse',
      quantiteDisponible: 50,
      categorie: CategorieProduit.FRUITS,
      imageUrl: 'https://via.placeholder.com/300x200?text=Mangue+Kent',
      vendeurId: '2',
      vendeurNom: 'Ferme Diallo',
      region: 'Thiès',
      certifieBio: false,
      createdAt: new Date('2024-11-01'),
      updatedAt: new Date('2024-11-01')
    },
    {
      id: '2',
      nom: 'Oignon Violet',
      description: 'Oignons violets de qualité',
      prix: 15000,
      unite: 'Sac 50kg',
      quantiteDisponible: 30,
      categorie: CategorieProduit.LEGUMES,
      imageUrl: 'https://via.placeholder.com/300x200?text=Oignon+Violet',
      vendeurId: '3',
      vendeurNom: 'Coopérative Baol',
      region: 'Diourbel',
      certifieBio: false,
      createdAt: new Date('2024-11-05'),
      updatedAt: new Date('2024-11-05')
    },
    {
      id: '3',
      nom: 'Arachide',
      description: 'Arachides de qualité',
      prix: 25000,
      unite: 'Sac 100kg',
      quantiteDisponible: 20,
      categorie: CategorieProduit.CEREALES,
      imageUrl: 'https://via.placeholder.com/300x200?text=Arachide',
      vendeurId: '1',
      vendeurNom: 'Ferme Ndiaye',
      region: 'Kaolack',
      certifieBio: false,
      createdAt: new Date('2024-11-10'),
      updatedAt: new Date('2024-11-10')
    }
  ];

  private mockCommandes: Commande[] = [
    {
      id: '1',
      numeroCommande: '#AGS-84321',
      acheteurId: '4',
      acheteurNom: 'Aïssatou Fall',
      vendeurId: '1',
      vendeurNom: 'Moussa Diop',
      produits: [
        {
          produitId: '3',
          produitNom: 'Arachide',
          quantite: 50,
          prixUnitaire: 25000,
          prixTotal: 1250000
        }
      ],
      prixTotal: 1250000,
      statut: StatutCommande.LIVREE,
      dateCommande: new Date('2024-11-15'),
      dateLivraisonReelle: new Date('2024-11-20')
    },
    {
      id: '2',
      numeroCommande: '#AGS-84320',
      acheteurId: '5',
      acheteurNom: 'Fatou Sow',
      vendeurId: '1',
      vendeurNom: 'Moussa Diop',
      produits: [
        {
          produitId: '1',
          produitNom: 'Mil',
          quantite: 120,
          prixUnitaire: 400,
          prixTotal: 48000
        }
      ],
      prixTotal: 48000,
      statut: StatutCommande.EXPEDIEE,
      dateCommande: new Date('2024-11-18'),
      dateLivraisonEstimee: new Date('2024-11-25')
    }
  ];

  getAllProduits(): Observable<Produit[]> {
    // SIMULATION
    return of([...this.mockProduits]).pipe(delay(500));
  }

  getProduitById(id: string): Observable<Produit> {
    // SIMULATION
    const produit = this.mockProduits.find(p => p.id === id);
    if (produit) {
      return of({ ...produit }).pipe(delay(300));
    }
    return of(this.mockProduits[0]).pipe(delay(300));
  }

  getCommandesVendeur(vendeurId: string): Observable<Commande[]> {
    // SIMULATION
    const commandes = this.mockCommandes.filter(c => c.vendeurId === vendeurId);
    return of(commandes).pipe(delay(500));
  }

  getCommandesAcheteur(acheteurId: string): Observable<Commande[]> {
    // SIMULATION
    const commandes = this.mockCommandes.filter(c => c.acheteurId === acheteurId);
    return of(commandes).pipe(delay(500));
  }
}

