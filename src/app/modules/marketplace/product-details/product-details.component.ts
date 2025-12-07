import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produit } from '../../../core/models/marketplace.model';
import { MarketplaceService } from '../../../core/services/marketplace.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  productId: string | null = null;
  produit: Produit | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProduct();
    }
  }

  loadProduct(): void {
    if (this.productId) {
      this.marketplaceService.getProduitById(this.productId).subscribe({
        next: (produit) => {
          this.produit = produit;
        }
      });
    }
  }
}

