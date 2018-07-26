import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { User } from '../_models/User';
import { Observable, throwError, observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/Message';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(page?: number, itemPerPage?: number, userParams?: any, likeParams?: any): Observable<PaginatedResult<User[]>> {
    const pagenatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let queryString = '?';
    if (page != null && itemPerPage != null) {
      queryString += 'pageNumber=' + page + '&pageSize=' + itemPerPage + '&';
    }

    if (likeParams === 'likers') {
      queryString += 'likers=true&';
    }

    if (likeParams === 'likees') {
      queryString += 'likees=true&';
    }

    if (userParams != null) {
      queryString +=
        'minAge=' + userParams.minAge +
        '&maxAge=' + userParams.maxAge +
        '&gender=' + userParams.gender +
        '&orderby=' + userParams.orderby;
    }

    return this.http.get(this.baseUrl + '/user' + queryString, this.jwt()).pipe(
      map((response: any) => {
        pagenatedResult.result = response;

        // const paging = response.headers.get('Pagination').toString();

        // if (response.headers.get('Pagination') != null) {
        //   pagenatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        // }

        return pagenatedResult;
      }),
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

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + '/user/' + id + '/like/' + recipientId, {}, this.jwt()).pipe(
      catchError(this.handleError)
    );
  }

  getMessages(id: number, page?: number, itemPerPage?: number, messageContainer?: any): Observable<PaginatedResult<Message[]>> {
    const pagenatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    let queryString = '?MessageContainer=' + messageContainer;
    if (page != null && itemPerPage != null) {
      queryString += '&pageNumber=' + page + '&pageSize=' + itemPerPage + '&';
    }

    return this.http.get(this.baseUrl + '/users/' + id + '/messages' + queryString, this.jwt()).pipe(
      map((response: any) => {
        pagenatedResult.result = response;

        // const paging = response.headers.get('Pagination').toString();

        // if (response.headers.get('Pagination') != null) {
        //   pagenatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        // }

        return pagenatedResult;
      }),
      catchError(this.handleError)
    );
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + '/users/' + id + '/messages/thread' + recipientId, this.jwt()).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + '/users/' + id + '/messages' , message, this.jwt()).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  deleteMessage(id: number, userId: number) {
    return this.http.delete(this.baseUrl + '/users/' + userId + '/messages/'  + id, this.jwt()).pipe(
      catchError(this.handleError)
    );
  }

  markAsRead(userId: number, messageId: number) {
    return this.http.post(this.baseUrl + '/users/' + userId + '/messages/'  + messageId + '/read', {}, this.jwt()).pipe(
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
    if (error.status === 400) {
      return throwError(error.error);
    }

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
