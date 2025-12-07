import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketplaceListComponent } from './marketplace-list/marketplace-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {
    path: '',
    component: MarketplaceListComponent
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent
  },
  {
    path: 'orders',
    component: OrdersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }

