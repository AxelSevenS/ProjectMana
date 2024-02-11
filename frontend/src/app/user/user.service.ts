import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, UserAuths } from './user.model';
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

  getAuths(user?: User): UserAuths {
    return {
      UserEditor: user?.roles?.includes("UserEditor") ?? false,
      AuthEditor: user?.roles?.includes("AuthEditor") ?? false,
      UserDeleter: user?.roles?.includes("UserDeleter") ?? false,
      SongCreator: user?.roles?.includes("SongCreator") ?? false,
      SongEditor: user?.roles?.includes("SongEditor") ?? false,
      SongDeleter: user?.roles?.includes("SongDeleter") ?? false,
      PlaylistCreator: user?.roles?.includes("PlaylistCreator") ?? false,
      PlaylistEditor: user?.roles?.includes("PlaylistEditor") ?? false,
      PlaylistDeleter: user?.roles?.includes("PlaylistDeleter") ?? false,
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
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
  }

  getUserById(id: number): Observable<User | HttpErrorResponse> {
    return this.http.get<User>(`${environment.host}/api/users/${id}`)
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
  }

  updateUserById(id: number, user: User): Observable<User | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('roles', user.roles);
    if (user?.password) formData.append('password', user.password);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    return this.http.put<User>(`${environment.host}/api/users/${id}`, formData, {headers: headers})
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
  }

}