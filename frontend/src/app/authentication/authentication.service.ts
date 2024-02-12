import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { User, UserAuths } from '../user/user.model';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

export declare type LoginState = 'loggedIn' | 'loggedOut' | 'disconnected';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public static readonly storageKey: string = "JWT";

  public get state() { return this._state }
  private _state: LoginState;

  private _user: User | null = null;
  public get user() { return this._user }

  private _auths: UserAuths = this.userService.getAuths(undefined);
  public get auths() { return this._auths }

  constructor(
    private userService: UserService,
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
    this._auths = this.userService.getAuths(this._user.roles);
    this._state = 'loggedIn';
  }


  login(username: string, password: string): Observable<User | HttpErrorResponse> {
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
          this._auths = this.userService.getAuths(this._user.roles);
          return this._user;
        }), 
        catchError((err: HttpErrorResponse) => {
          this._user = null;
          this._state = err.error == 0 ? 'disconnected' : 'loggedOut';
          this._auths = this.userService.getAuths(undefined);
          return of(err);
        })
      );
  }

  register(username: string, password: string): Observable<User | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.http.put<User>(`${environment.host}/api/users/`, formData, {headers: headers})
      .pipe(
        catchError(err => of(err) )
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
      decoded.sub === undefined ||
      decoded.name === undefined ||
      decoded.roles === undefined ||
      decoded.exp === undefined ||
      decoded.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    
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
  roles?: string
}