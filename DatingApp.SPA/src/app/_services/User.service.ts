import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../_models/User';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get(this.baseUrl + '/user', this.jwt()).pipe(
      map(response => <User[]>response),
      catchError(this.handleError)
    );
  }

  getUser(id): Observable<User> {
    return this.http.get(this.baseUrl + '/user/' + id, this.jwt()).pipe(
      map(response => <User>response),
      catchError(this.handleError)
    );
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + '/user/' + id, user, this.jwt()).pipe(
      catchError(this.handleError)
    );
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + '/users/' + userId + '/photos/' + id + '/setMain', {}, this.jwt()).pipe(
      catchError(this.handleError)
    );
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + '/users/' + userId + '/photos/' + id, this.jwt()).pipe(
      catchError(this.handleError)
    );
  }

  private jwt() {
    const token = localStorage.getItem('token');

    if (token) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
      };

      return httpOptions;

    }
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
    return throwError(
      modelStateErrors || 'Server error'
    );
  }

}
