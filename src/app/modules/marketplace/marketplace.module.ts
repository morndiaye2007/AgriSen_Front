import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { MarketplaceListComponent } from './marketplace-list/marketplace-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
  declarations: [
    MarketplaceListComponent,
    ProductDetailsComponent,
    OrdersComponent
  ],
  imports: [
    SharedModule,
    MarketplaceRoutingModule
  ]
})
export class MarketplaceModule { }

