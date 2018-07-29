import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { User } from '../_models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthUser } from '../_models/AuthUser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl;
  userToken: any;
  decodedToken: any;
  currentUser: User;
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient,
    private jwtHelperService: JwtHelperService) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<AuthUser>(this.baseUrl + '/auth/login', model, httpOptions).pipe(
      map((response) => {
        const user: any = response;
        if (user) {
          localStorage.setItem('token', user.tokenString);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelperService.decodeToken(user.tokenString);
          this.currentUser = user.user;
          this.userToken = user.tokenString;
          if (this.currentUser.photoUrl !== null) {
            this.changeMemberPhoto(this.currentUser.photoUrl);
          } else {
            this.changeMemberPhoto('../../assets/user.png');
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  register(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.baseUrl + '/auth/register', user, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  loggedin() {
    const token = this.jwtHelperService.tokenGetter();
    if (!token) {
      return false;
    }

    return !this.jwtHelperService.isTokenExpired(token);
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
