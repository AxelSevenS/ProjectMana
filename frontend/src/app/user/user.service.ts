import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import { Observable, catchError, of } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

export declare type AuthenticationState = 'loggedIn' | 'loggedOut' | 'disconnected';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.host}/api/users`)
      .pipe( catchError(() => {
        return [];
      }));
  }

  getUserById(id: number): Observable<User | null> {
    return this.http.get<User>(`${environment.host}/api/users/${id}`)
      .pipe( catchError(() => {
        return of(null);
      }));
  }

  updateUserById(id: number, user: User): Observable<User | null> {
    let token = localStorage.getItem(AuthenticationService.storageKey);
    if ( ! token ) return of(null);

    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('roles', user.roles);
    if (user?.password) formData.append('password', user.password);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.put<User>(`${environment.host}/api/users/${id}`, formData, {headers: headers})
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }

}