import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, catchError, first, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Playlist } from './playlist.model';
import { AuthenticationService } from '../authentication/authentication.service';
import mime from 'mime';

export declare type AuthenticationState = 'loggedIn' | 'loggedOut' | 'disconnected';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private updateEvent = new Subject<Playlist>();

  public get userPlaylists() { return this._userPlaylists };
  private _userPlaylists?: Playlist[] | null;

  constructor(
    private authentication: AuthenticationService,
    private http: HttpClient
  ) {
    if (! this._userPlaylists && this.authentication.user) {
      this.getPlaylistByAuthorId(this.authentication.user.id)
        .pipe(first())
        .subscribe(res => {
          console.log(res);
          if (res instanceof HttpErrorResponse) {
            this._userPlaylists = null;
            return;
          };
  
          this._userPlaylists = res;
        })
    }
  }


  getPlaylists(): Observable<Playlist[] | HttpErrorResponse> {
    return this.http.get<Playlist[]>(`${environment.host}/api/playlists`)
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
  }

  getPlaylistById(id: number): Observable<Playlist | HttpErrorResponse> {
    return this.http.get<Playlist>(`${environment.host}/api/playlists/${id}`)
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
  }

  getPlaylistByAuthorId(id: number): Observable<Playlist[] | HttpErrorResponse> {
    return this.http.get<Playlist[]>(`${environment.host}/api/playlists/byAuthor/${id}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err);
        }
      ));
  }

  createPlaylist(name: string): Observable<Playlist | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('name', name);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}`, 'enctype': 'multipart/form-data' });

    return this.http.put<Playlist>(`${environment.host}/api/playlists`, formData, {headers: headers})
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
  }

  updatePlaylistById(id: number, playlist: Partial<Playlist>): Observable<Playlist | HttpErrorResponse> {
    const formData = new FormData();
    if (playlist.name != undefined) formData.append('name', playlist.name);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    return this.http.patch<Playlist>(`${environment.host}/api/playlists/${id}`, formData, {headers: headers})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  AddSongById(playlistId: number, songId: number): Observable<Playlist | HttpErrorResponse> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    return this.http.post<Playlist>(`${environment.host}/api/playlists/${playlistId}/addSong/${songId}`, {}, {headers: headers})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  removeSongById(playlistId: number, songId: number): Observable<Playlist | HttpErrorResponse> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    return this.http.post<Playlist>(`${environment.host}/api/playlists/${playlistId}/removeSong/${songId}`, {}, {headers: headers})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  deletePlaylistById(id: number): Observable<Playlist | HttpErrorResponse> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    return this.http.delete<Playlist>(`${environment.host}/api/playlists/${id}`, {headers: headers})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

}