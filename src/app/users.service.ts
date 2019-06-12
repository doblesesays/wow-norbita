import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';

@Injectable()
export class UsersService {

  public user?: Object;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    if (this.isLoggedIn()) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  register(email, password) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.api + '/auth/register', { email, password }).toPromise().then((user: any) => {
        if (user.error) {
          reject(user.error);
        }
        resolve(user);
      });
    });
  }

  login(email, password) {
    var headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(email + ':' + password)
    })
    return new Promise((resolve, reject) => {
      this.http.post(environment.api + '/auth/login', null, { headers }).toPromise().then((res: any) => {
        console.log(res.token)
        console.log(res.user)
        if (res.error) {
          reject(res.error);
        } else {
          this.user = res.user;
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('token', res.token);
          resolve(res);
        }
      });
    });
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }

  logout() {
    localStorage.clear();
    this.user = null;
    this.router.navigateByUrl('/');
  }

}