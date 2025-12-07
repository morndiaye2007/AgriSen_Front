import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategorieProduit, Produit } from '../../../core/models/marketplace.model';
import { MarketplaceService } from '../../../core/services/marketplace.service';

@Component({
  selector: 'app-marketplace-list',
  templateUrl: './marketplace-list.component.html',
  styleUrls: ['./marketplace-list.component.scss']
})
export class MarketplaceListComponent implements OnInit {
  categories = [
    { value: 'toutes', label: 'Toutes les Catégories' },
    { value: CategorieProduit.FRUITS, label: 'Fruits' },
    { value: CategorieProduit.LEGUMES, label: 'Légumes' },
    { value: CategorieProduit.CEREALES, label: 'Céréales' },
    { value: CategorieProduit.BETAILL, label: 'Bétail' }
  ];
  selectedCategory = 'toutes';
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];

  constructor(
    private router: Router,
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.marketplaceService.getAllProduits().subscribe({
      next: (produits) => {
        this.produits = produits;
        this.filteredProduits = produits;
      }
    });
  }

  filterByCategory(): void {
    if (this.selectedCategory === 'toutes') {
      this.filteredProduits = this.produits;
    } else {
      this.filteredProduits = this.produits.filter(p => p.categorie === this.selectedCategory);
    }
  }

  viewProduct(id: string): void {
    this.router.navigate(['/dashboard/marketplace/product', id]);
  }
}

