import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, catchError, first, of, share } from 'rxjs';
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

  public get eventAdded() { return this._eventAdded };
  public _eventAdded: Subject<Playlist> = new Subject<Playlist>;

  public get eventRemoved() { return this._eventRemoved };
  public _eventRemoved: Subject<Playlist> = new Subject<Playlist>;

  public get eventUpdated() { return this._eventUpdated };
  public _eventUpdated: Subject<Playlist> = new Subject<Playlist>;

  constructor(
    private http: HttpClient
  ) {}


  getPlaylists(): Observable<Playlist[] | HttpErrorResponse> {
    return this.http.get<Playlist[]>(`${environment.host}/api/playlists`)
      .pipe(
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  getPlaylistById(id: number): Observable<Playlist | HttpErrorResponse> {
    return this.http.get<Playlist>(`${environment.host}/api/playlists/${id}`)
      .pipe(
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  getPlaylistsByAuthorId(id: number): Observable<Playlist[] | HttpErrorResponse> {
    return this.http.get<Playlist[]>(`${environment.host}/api/playlists/byAuthor/${id}`)
      .pipe(
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        }
      ));
  }

  createPlaylist(name: string): Observable<Playlist | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('name', name);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}`, 'enctype': 'multipart/form-data' });

    let observable = this.http.put<Playlist>(`${environment.host}/api/playlists`, formData, {headers: headers})
      .pipe(
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );

    observable
      .subscribe(res => {
        if (res instanceof HttpErrorResponse) return;
        this._eventAdded.next(res);
      });
    
    return observable;
  }

  updatePlaylistById(id: number, playlist: Partial<Playlist>): Observable<Playlist | HttpErrorResponse> {
    const formData = new FormData();
    if (playlist.name != undefined) formData.append('name', playlist.name);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    let observable = this.http.patch<Playlist>(`${environment.host}/api/playlists/${id}`, formData, {headers: headers})
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

  addSongById(playlistId: number, songId: number): Observable<Playlist | HttpErrorResponse> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    let observable = this.http.post<Playlist>(`${environment.host}/api/playlists/${playlistId}/addSong/${songId}`, {}, {headers: headers})
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

  removeSongById(playlistId: number, songId: number): Observable<Playlist | HttpErrorResponse> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    let observable = this.http.post<Playlist>(`${environment.host}/api/playlists/${playlistId}/removeSong/${songId}`, {}, {headers: headers})
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

  deletePlaylistById(id: number): Observable<Playlist | HttpErrorResponse> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    let observable = this.http.delete<Playlist>(`${environment.host}/api/playlists/${id}`, {headers: headers})
      .pipe(
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );

    observable
      .subscribe(res => {
        if (res instanceof HttpErrorResponse) return;
        this._eventRemoved.next(res);
      });
    
    return observable;
  }

}