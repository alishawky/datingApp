import { Injectable } from '@angular/core';
// import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
// import { tokenNotExpired } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  decodedToken: any;

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
      }),
      catchError(this.handleError)
    );
  }

  register(model: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.baseUrl + 'register', model, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // loggedin() {
  //   return tokenNotExpired('token');
  // }

  private handleError(error: any) {
    const applicationError = error.headers.get('Application-Error');
    if (applicationError) {
      // return Observable.throw(applicationError);
      return throwError(applicationError);
    }

    const serverError = error;
    let modelStateErrors = '';
    if (serverError) {
      for (const key in serverError.error) {
        if (serverError.error[key]) {
          modelStateErrors += serverError.error[key] + '\n';
        }

      }
    }

    // return Observable.throw(
    //   modelStateErrors || 'Server error'
    // );

    return throwError(
      modelStateErrors || 'Server error'
    );
  }
}
