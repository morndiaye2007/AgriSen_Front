import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Commande, StatutCommande } from '../../../core/models/marketplace.model';
import { MarketplaceService } from '../../../core/services/marketplace.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  displayedColumns: string[] = ['numeroCommande', 'client', 'produit', 'quantite', 'prixTotal', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Commande>([]);
  selectedView = 0; // 0 = ventes, 1 = achats

  constructor(
    private marketplaceService: MarketplaceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    const userId = this.authService.getCurrentUser()?.id || '1';
    if (this.selectedView === 0) {
      // Ventes (vue agriculteur)
      this.marketplaceService.getCommandesVendeur(userId).subscribe({
        next: (commandes) => {
          this.dataSource.data = commandes;
        }
      });
    } else {
      // Achats (vue acheteur)
      this.marketplaceService.getCommandesAcheteur(userId).subscribe({
        next: (commandes) => {
          this.dataSource.data = commandes;
        }
      });
    }
  }

  onTabChange(index: number): void {
    this.selectedView = index;
    this.loadCommandes();
  }

  getStatutClass(statut: StatutCommande): string {
    const classes: { [key: string]: string } = {
      'en_attente': 'statut-pending',
      'confirmee': 'statut-confirmed',
      'expediee': 'statut-shipped',
      'livree': 'statut-delivered',
      'annulee': 'statut-cancelled'
    };
    return classes[statut] || '';
  }
}

