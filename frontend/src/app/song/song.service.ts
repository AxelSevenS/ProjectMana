import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Song } from './song.model';
import { AuthenticationService } from '../authentication/authentication.service';
import mime from 'mime';

export declare type AuthenticationState = 'loggedIn' | 'loggedOut' | 'disconnected';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(
    private authentication: AuthenticationService,
    private http: HttpClient
  ) { }

  getSongFileUrl(song: Song): string {
    return `${environment.host}/api/songs/file/${song.id}`;
  }

  getSongs(): Observable<Song[] | HttpErrorResponse> {
    return this.http.get<Song[]>(`${environment.host}/api/songs`)
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
  }

  getSongById(id: number): Observable<Song | HttpErrorResponse> {
    return this.http.get<Song>(`${environment.host}/api/songs/${id}`)
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
  }

  getSongByPlaylistId(id: number): Observable<Song[] | HttpErrorResponse> {
    return this.http.get<Song[]>(`${environment.host}/api/songs/fromPlaylist/${id}`)
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
  }

  getSongsByAuthorId(id: number): Observable<Song[] | HttpErrorResponse> {
    return this.http.get<Song[]>(`${environment.host}/api/songs/byAuthor/${id}`)
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
  }

  createSong(name: string, description: string, file: Blob): Observable<Song | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('file', file);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}`, 'enctype': 'multipart/form-data' });

    return this.http.put<Song>(`${environment.host}/api/song`, formData, {headers: headers})
      .pipe( catchError((err: HttpErrorResponse) => {
        return of(err);
      }));
  }

  updateSongById(id: number, song: Song): Observable<Song | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('name', song.name);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    return this.http.put<Song>(`${environment.host}/api/song/${id}`, formData, {headers: headers})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  deleteSongById(id: number): Observable<Song | HttpErrorResponse> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    return this.http.delete<Song>(`${environment.host}/api/song/${id}`, {headers: headers})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

}