import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  public products;

  constructor(
    private productsService: ProductsService,
  ) { }

  async ngOnInit() {
    this.products = await this.productsService.getProducts();
    console.log(this.products)
  }

}
