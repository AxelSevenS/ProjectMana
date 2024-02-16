import { Injectable, OnInit } from "@angular/core";
import { SongService } from "./song.service";
import { Song } from "./song.model";
import { first } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authentication/authentication.service";

@Injectable({
	providedIn: 'root'
})
export class UserSongsProvider {

	public get songs() { return this._songs };
	public _songs?: Song[] | null;

	constructor(
		private _authentication: AuthenticationService,
		private _songService: SongService
	) {
		if (this._authentication.user && ! this._songs) {
		  this._songService.getSongsByAuthorId(this._authentication.user.id)
			.subscribe(res => {
			  if (res instanceof HttpErrorResponse) {
				this._songs = null;
				return;
			  };
	  
			  this._songs = res;
			})
		}
		
		this._songService.eventAdded
			.subscribe(song => {
				if (song.authorId != this._authentication.user?.id) return;
				this._songs?.push(song);
			});

		this._songService.eventRemoved
			.subscribe(song => {
				if ( ! this._songs || song.authorId != this._authentication.user?.id ) return;
				let index = this._songs?.findIndex(s => s.id == song.id);
				this._songs?.splice(index, 1);
			});

		this._songService.eventUpdated
			.subscribe(song => {
				if ( ! this._songs || song.authorId != this._authentication.user?.id ) return;
				let index = this._songs?.findIndex(s => s.id == song.id);
				this._songs?.splice(index, 1, song);
			});
	}
}