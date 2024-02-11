import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getSongMimeType(song: Song): string {    
    return mime.getType(song.extension ?? '') ?? '';
  }

  getSongFileUrl(song: Song): string {
    return `${environment.host}/Resources/Song/${song.id}.${song.extension}`;
  }

  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${environment.host}/api/song`)
      .pipe( catchError(err => {
        return [];
      }));
  }

  getSongById(id: number): Observable<Song | null> {
    return this.http.get<Song>(`${environment.host}/api/song/${id}`)
      .pipe( catchError(() => {
        return of(null);
      }));
  }

  getSongByAuthorId(id: number): Observable<Song[] | null> {
    return this.http.get<Song[]>(`${environment.host}/api/song/byAuthor/${id}`)
      .pipe( catchError(() => {
        return of(null);
      }));
  }

  createSong(name: string, description: string, file: Blob): Observable<Song | null> {
    let token = localStorage.getItem(AuthenticationService.storageKey);
    if ( ! token ) return of(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('file', file);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'enctype': 'multipart/form-data' });

    return this.http.put<Song>(`${environment.host}/api/song`, formData, {headers: headers})
      .pipe( catchError(e => {
        return of(null);
      }));
  }

  updateSongById(id: number, song: Song): Observable<Song | null> {
    let token = localStorage.getItem(AuthenticationService.storageKey);
    if ( ! token ) return of(null);

    const formData = new FormData();
    formData.append('name', song.name);
    formData.append('description', song.description);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.put<Song>(`${environment.host}/api/song/${id}`, formData, {headers: headers})
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }

  deleteSongById(id: number): Observable<Song | null> {
    let token = localStorage.getItem(AuthenticationService.storageKey);
    if ( ! token ) return of(null);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.delete<Song>(`${environment.host}/api/song/${id}`, {headers: headers})
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }

}