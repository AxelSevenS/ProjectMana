import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SpotifyService {
  
	private clientId = '5c5b5522233e466e82951315bc93ceab';
	private clientSecret = '6ab5cae0265a4c109ff2ada7a15edc11';
	private accessToken!: string;

	constructor(private httpClient: HttpClient) { }

	private getAccessToken(): Observable<any> {
		const authString = btoa(`${this.clientId}:${this.clientSecret}`);
		const headers = new HttpHeaders({
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${authString}`
		});
		const body = 'grant_type=client_credentials';

		return this.httpClient.post<any>('https://accounts.spotify.com/api/token', body, { headers });
	}

	search(query: string): Observable<any> {
		if (!this.accessToken) {
		return this.getAccessToken().pipe(
			switchMap(response => {
				this.accessToken = response.access_token;
				return this.search(query);
			})
		);
		}

		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.accessToken}`
		});

		return this.httpClient.get<any>(`https://api.spotify.com/v1/search?q=${query}&type=track`, { headers });
	}
}
