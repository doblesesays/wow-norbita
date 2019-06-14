import { environment } from './../../environments/environment';
import { UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  public products = [];
  public user;
  public shared = null;
  public url = environment.app + '/wishlist;id=';

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
  ) { }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));

    this.activatedRoute.params.subscribe(params => {
      // Recibiendo parametros aqui
      if (params.id) {
        this.userService.getUserWishlist(params.id).then(({wishlist, email}) => {
          this.shared = email;
          this.products = wishlist;
        })
        .catch((error) => {
          this.toastr.error(error, 'Error!');
        })
      } else if (this.user) {
        this.shared = null;
        this.products = this.user.wishlist;
      } else {
        this.shared = null;
        this.router.navigateByUrl('/');
      }

    })
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

  clipboard(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.success(`Share your wishlist: ${val}`, 'Copied to clipboard!');
  }

}
