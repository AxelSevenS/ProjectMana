import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, UserAuths } from './user.model';
import { Observable, Subject, catchError, of, share } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

export declare type AuthenticationState = 'loggedIn' | 'loggedOut' | 'disconnected';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public get eventAdded() { return this._eventAdded };
  public _eventAdded: Subject<User> = new Subject<User>;

  public get eventRemoved() { return this._eventRemoved };
  public _eventRemoved: Subject<User> = new Subject<User>;

  public get eventUpdated() { return this._eventUpdated };
  public _eventUpdated: Subject<User> = new Subject<User>;
  
  constructor(
    private http: HttpClient
  ) { }

  getAuths(roles?: string): UserAuths {
    return {
      UserEditor: roles?.includes("UserEditor") ?? false,
      AuthEditor: roles?.includes("AuthEditor") ?? false,
      UserDeleter: roles?.includes("UserDeleter") ?? false,
      SongCreator: roles?.includes("SongCreator") ?? false,
      SongEditor: roles?.includes("SongEditor") ?? false,
      SongDeleter: roles?.includes("SongDeleter") ?? false,
      PlaylistCreator: roles?.includes("PlaylistCreator") ?? false,
      PlaylistEditor: roles?.includes("PlaylistEditor") ?? false,
      PlaylistDeleter: roles?.includes("PlaylistDeleter") ?? false,
    }
  }
  
  getRolesList(auths: UserAuths): string[] {
    let roles: string[] = [];

    if (auths.UserEditor) roles.push('UserEditor');
    if (auths.AuthEditor) roles.push('AuthEditor');
    if (auths.UserDeleter) roles.push('UserDeleter');
    if (auths.SongCreator) roles.push('SongCreator');
    if (auths.SongEditor) roles.push('SongEditor');
    if (auths.SongDeleter) roles.push('SongDeleter');
    if (auths.PlaylistCreator) roles.push('PlaylistCreator');
    if (auths.PlaylistEditor) roles.push('PlaylistEditor');
    if (auths.PlaylistDeleter) roles.push('PlaylistDeleter');
    
    return roles;
  }
  getRolesString(auths: UserAuths): string {
    return this.getRolesList(auths).join(',');
  }

  getRolesFlags(auths: UserAuths): number {
    let roles: number = 0;

    if (auths.UserEditor) roles |= 1 << 0;
    if (auths.AuthEditor) roles |= 1 << 1;
    if (auths.UserDeleter) roles |= 1 << 2;
    if (auths.SongCreator) roles |= 1 << 3;
    if (auths.SongEditor) roles |= 1 << 4;
    if (auths.SongDeleter) roles |= 1 << 5;
    if (auths.PlaylistCreator) roles |= 1 << 6;
    if (auths.PlaylistEditor) roles |= 1 << 7;
    if (auths.PlaylistDeleter) roles |= 1 << 8;
    
    return roles;
  }

  getUsers(): Observable<User[] | HttpErrorResponse> {
    return this.http.get<User[]>(`${environment.host}/api/users`)
      .pipe(
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  getUserById(id: number): Observable<User | HttpErrorResponse> {
    return this.http.get<User>(`${environment.host}/api/users/${id}`)
      .pipe(
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  updateUserById(id: number, user: Partial<User>): Observable<User | HttpErrorResponse> {
    const formData = new FormData();
    let roles = this.getRolesFlags(this.getAuths(user.roles)).toString();

    if (user.username) formData.append('username', user.username);
    if (user.password) formData.append('password', user.password);
    if (user.roles) formData.append('roles', roles);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    let observable = this.http.patch<User>(`${environment.host}/api/users/${id}`, formData, {headers: headers})
      .pipe(
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );

    observable
      .subscribe(res => {
        if (res instanceof HttpErrorResponse) return;
        this._eventUpdated.next(res);
      });
    
    return observable;
  }

}