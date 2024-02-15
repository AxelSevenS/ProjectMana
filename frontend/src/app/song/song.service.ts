import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, first, of, share } from 'rxjs';
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
    private http: HttpClient
  ) {}

  public get eventAdded() { return this._eventAdded };
  public _eventAdded: Subject<Song> = new Subject<Song>;

  public get eventRemoved() { return this._eventRemoved };
  public _eventRemoved: Subject<Song> = new Subject<Song>;

  public get eventUpdated() { return this._eventUpdated };
  public _eventUpdated: Subject<Song> = new Subject<Song>;
  

  getSongFileUrl(song: Song): string {
    return `${environment.host}/api/songs/file/${song.id}`;
  }

  getSongs(): Observable<Song[] | HttpErrorResponse> {
    return this.http.get<Song[]>(`${environment.host}/api/songs`)
      .pipe(
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  getSongById(id: number): Observable<Song | HttpErrorResponse> {
    return this.http.get<Song>(`${environment.host}/api/songs/${id}`)
      .pipe(
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  getSongByPlaylistId(id: number): Observable<Song[] | HttpErrorResponse> {
    return this.http.get<Song[]>(`${environment.host}/api/songs/fromPlaylist/${id}`)
      .pipe(
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  getSongsByAuthorId(id: number): Observable<Song[] | HttpErrorResponse> {
    return this.http.get<Song[]>(`${environment.host}/api/songs/byAuthor/${id}`)
      .pipe( 
        share(),
        catchError((err: HttpErrorResponse) => {
          return of(err);
        })
      );
  }

  createSong(name: string, file: Blob): Observable<Song | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}`, 'enctype': 'multipart/form-data' });

    let observable = this.http.put<Song>(`${environment.host}/api/songs`, formData, {headers: headers})
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

  updateSongById(id: number, song: Partial<Song>): Observable<Song | HttpErrorResponse> {
    const formData = new FormData();
    if (song.authorId) formData.append('authorId', song.authorId.toString());
    if (song.name) formData.append('name', song.name);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    let observable = this.http.patch<Song>(`${environment.host}/api/songs/${id}`, formData, {headers: headers})
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

  deleteSongById(id: number): Observable<Song | HttpErrorResponse> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(AuthenticationService.storageKey)}` });

    let observable = this.http.delete<Song>(`${environment.host}/api/songs/${id}`, {headers: headers})
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