import { Injectable } from '@angular/core';
// import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
// import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;

  constructor(private http: HttpClient) { }

  login(model: any) {
    // const headers = new HttpHeaders({ 'content-type': 'application/json' });
    // const options = new RequestOptions({ headers: headers });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(this.baseUrl + 'login', model, httpOptions).pipe(
      map((response: Response) => {
        const user: any = response;
        if (user) {
          localStorage.setItem('token', user.tokenString);
          this.userToken = user.tokenString;
        }
      })
    );
  }

  register(model: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.baseUrl + 'register', model, httpOptions);
  }
}
