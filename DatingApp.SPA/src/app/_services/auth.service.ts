import { Injectable } from '@angular/core';
// import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { User } from '../_models/User';
// import { tokenNotExpired } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  currentUser: User;
  decodedToken: any;
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

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
          localStorage.setItem('user', JSON.stringify(user.user));
          this.userToken = user.tokenString;
          this.currentUser = user.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
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

  loggedin() {
    // return tokenNotExpired('token');
    const token = localStorage.getItem('token');
    return !!token;
  }

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
