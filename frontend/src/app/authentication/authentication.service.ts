import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, share } from 'rxjs';
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

    this.userService.eventRemoved
      .subscribe(res => {
        if (res.id != this._user?.id) return;

        this.logout();
      });

    this.userService.eventUpdated
      .subscribe(res => {
        if (res.id != this._user?.id) return;

        this.logout();

        this.router.navigate(['/authentication'])
          .then(() => {
            window.location.reload();
          });
      });
  }


  login(username: string, password: string): Observable<User | HttpErrorResponse> {

    return this.userService.authenticateUserByUsernameAndPassword(username, password)
      .pipe(
        map(res => {
          if (res instanceof HttpErrorResponse) {
            this._user = null;
            this._state = res.error == 0 ? 'disconnected' : 'loggedOut';
            this._auths = this.userService.getAuths(undefined);
            return res;
          }

          this._user = this.jwtToUser(res);
          if (this._user === null) throw new HttpErrorResponse({ error: 400 });
          
          localStorage.setItem(AuthenticationService.storageKey, res);
          this._state = 'loggedIn';
          this._auths = this.userService.getAuths(this._user.roles);
          return this._user;
        })
      );
  }

  register(username: string, password: string): Observable<User | HttpErrorResponse> {
    return this.userService.createUser(username, password);
  }

  logout(): void {
    this._user = null;
    this._state = 'loggedOut';
    localStorage.removeItem(AuthenticationService.storageKey);
    
    this.router.navigate([''])
      .then(() => {
        window.location.reload();
      });
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