import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { User } from '../user/user.model';
import { Router } from '@angular/router';

export declare type LoginState = 'loggedIn' | 'loggedOut' | 'disconnected';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public static readonly storageKey: string = "JWT";

  private _state: LoginState;
  public get state() : LoginState {
    return this._state;
  }

  private _user: User | null = null;
  public get user() : User | null {
    return this._user;
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this._state = 'loggedOut';

    let jwt = localStorage.getItem(AuthenticationService.storageKey);
    if (jwt === null) return;
    
    let user = this.jwtToUser(jwt);
    if (user === null) {
      localStorage.removeItem(AuthenticationService.storageKey);
      return;
    }

    this._user = user;
    this._state = 'loggedIn';
  }

  login(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.http.post<string>(`${environment.host}/api/users/auth/`, formData, {headers: headers})
      .pipe( 
        map(res => {
          this._user = this.jwtToUser(res);
          if (this._user === null) throw new HttpErrorResponse({ error: 400 });
          
          localStorage.setItem(AuthenticationService.storageKey, res);
          this._state = 'loggedIn';
          return this._user;
        }), 
        catchError(err => {
          this._user = null;
          if (err instanceof HttpErrorResponse) {
            this._state = err.error == 0 ? 'disconnected' : 'loggedOut';
          }
          return of(this._user);
        })
      );
  }

  register(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.http.put<User>(`${environment.host}/api/users/`, formData, {headers: headers})
      .pipe(
        catchError(err => of(null) )
      );
  }

  logout(): void {
    this._user = null;
    this._state = 'loggedOut';
    localStorage.removeItem(AuthenticationService.storageKey);
    this.router.navigate(['']);
  }

  private jwtToUser(token: string): User | null {
    let decoded = jwtDecode<UserPayload>(token);
    if ( 
      ! decoded.sub ||
      ! decoded.name ||
      ! decoded.roles ||
      ! decoded.exp ||
      decoded.exp <= Math.floor(Date.now() / 1000)
    )
      return null;
    
    return {
      id: parseInt(decoded.sub),
      username: decoded.name,
      roles: decoded.roles,
    }
  }
}


interface UserPayload extends JwtPayload {
  sub?: string,
  name?: string,
  roles?: "Admin" | "Client"
}