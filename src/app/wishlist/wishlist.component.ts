import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  public products;
  public user;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));

    if (this.user===null) {
      this.router.navigateByUrl('/');
    } else {
      this.products = this.user.wishlist;
    }
  }

  async deleteFromWishlist(product) {
    this.productsService.deleteFromWishlist(product).then(({wishlist}) => {
      this.products = wishlist;
      this.toastr.success('You have removed the product from your wish list!', 'Done!');
    })
    .catch((error) => {
      this.toastr.error(error, 'Error!');
    })
  }

}
