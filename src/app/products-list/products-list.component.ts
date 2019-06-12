import { ProductsService } from './../products.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  public products;

  constructor(
    private productsService: ProductsService
  ) { }

  async ngOnInit() {
    this.products = await this.productsService.getProducts();
    console.log(this.products)
  }

}
