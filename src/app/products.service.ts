import { UsersService } from './users.service';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class ProductsService {

  private products = [];

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
  ) { }

  getProducts(category = 'dishwashers') {
    return new Promise((resolve, reject) => {
      this.http.get(environment.api + '/products' + `/${category}`).toPromise().then((products: any) => {
        resolve(products);
      }, (err) => {
        reject(err);
      });
    });
  }

  addToWishlist(product) {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
    return new Promise((resolve, reject) => {
      this.http.post(environment.api + '/product', product, {headers}).toPromise().then((user: any) => {
        if(user.error) {
          reject(user.error);
        } else {
          this.usersService.setUser(user);
          resolve(true);
        }
      })
    });
  }

  deleteFromWishlist(product) {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    })
    return new Promise((resolve, reject) => {
      this.http.delete(environment.api + '/product' + `/${product._id}`, {headers}).toPromise().then((user: any) => {
        if(user.error) {
          reject(user.error);
        } else {
          this.usersService.setUser(user);
          resolve(user);
        }
      })
    });
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
