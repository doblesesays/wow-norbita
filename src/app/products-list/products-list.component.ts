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
  public user;
  public category = 'dishwashers';
  public sort = 'price_asc';

  constructor(
    private productsService: ProductsService,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    this.products = [];

    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user) {
      this.products = await this.getProductsWithWishlist();
      console.log(this.products)
    } else {
      this.products = await this.productsService.getProducts(this.category, this.sort);
      console.log(this.products)
    }
  }

  async addToWishlist(product) {
    this.productsService.addToWishlist(product).then(() => {
      product.onWishlist = true;
      this.toastr.success(`You have successfully add ${product.name} to your wishlist!`, 'Great!');
    })
      .catch((err) => {
        this.toastr.error(`Something went wrong`, 'Ups!');
      })
  }

  async getProductsWithWishlist() {
    var products;
    products = await this.productsService.getProducts(this.category, this.sort);
    var list = products.map((e) => {
      this.user.wishlist.forEach(element => {
        if (e.name === element.name) {
          e.onWishlist = true;
        }
      });
      return e;
    })
    return list;
  }

  async deleteFromWishlist(product) {
    this.productsService.deleteFromWishlist(product).then(({ wishlist }) => {
      product.onWishlist = false;
      this.toastr.success('You have removed the product from your wish list!', 'Done!');
    })
      .catch((error) => {
        this.toastr.error(error, 'Error!');
      })
  }

  async selectCategory(category) {
    this.products = [];
    this.category = category;
    console.log(this.category)
    this.products = await this.productsService.getProducts(this.category, this.sort);
  }

  async selectSort(sort) {
    this.products = [];
    this.sort = sort;
    console.log(this.sort)
    this.products = await this.productsService.getProducts(this.category, this.sort);
  }

}
