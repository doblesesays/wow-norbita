import { ProductsService } from './../products.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  public products;

  constructor(
    private productsService: ProductsService,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    this.products = await this.productsService.getProducts();
    console.log(this.products)
  }

  async addToWishlist(product) {
    this.productsService.addToWishlist(product).then(() => {
      this.toastr.success(`You have successfully add ${product.name} to your wishlist!`, 'Great!');
    })
    .catch((err) => {
      this.toastr.error( `Something went wrong`, 'Ups!');
    })
  }

}
