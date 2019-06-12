import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  register(email, password) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.api + '/auth/register', {email, password}).toPromise().then((user: any) => {
        if (user.error) {
          reject(user.error);
        }
        resolve(user);
      });
    });
  }

  login(email, password) {
    var headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(email+':'+password)
    })
    return new Promise((resolve, reject) => {
      this.http.post(environment.api + '/auth/login', null, {headers}).toPromise().then((user: any) => {
        console.log(user)
        if (user.error) {
          reject(user.error);
        }
        resolve(user);
      });
    });
  }

}