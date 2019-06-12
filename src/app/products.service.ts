import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ProductsService {

  private products = [];

  constructor(
    private http: HttpClient
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
}
