import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
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

  constructor(
    private http: HttpClient
  ) { }

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
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
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

  updatePlaylistById(id: number, playlist: Playlist): Observable<Playlist | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('name', playlist.name);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    return this.http.put<Playlist>(`${environment.host}/api/playlists/${id}`, formData, {headers: headers})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  // AddSongById(playlistId: number, songId: number): Observable<Playlist | HttpErrorResponse> {
  //   const formData = new FormData();
  //   formData.append('name', playlist.name);

  //   const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

  //   return this.http.put<Playlist>(`${environment.host}/api/playlists/${id}`, formData, {headers: headers})
  //     .pipe(
  //       catchError((err: HttpErrorResponse) => {
  //         return of(err);
  //       })
  //     );
  // }
  // removeSongById(playlistId: number, songId: number): Observable<Playlist | HttpErrorResponse> {
  //   const formData = new FormData();
  //   formData.append('name', playlist.name);

  //   const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

  //   return this.http.put<Playlist>(`${environment.host}/api/playlists/${id}`, formData, {headers: headers})
  //     .pipe(
  //       catchError((err: HttpErrorResponse) => {
  //         return of(err);
  //       })
  //     );
  // }

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