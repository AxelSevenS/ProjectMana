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

	public songs?: Song[] | null;

	constructor(
		private _authentication: AuthenticationService,
		private _songService: SongService
	) {
		if (this._authentication.user && ! this.songs) {
		  this._songService.getSongsByAuthorId(this._authentication.user.id)
			.pipe(first())
			.subscribe(res => {
			  if (res instanceof HttpErrorResponse) {
				this.songs = null;
				return;
			  };
	  
			  this.songs = res;
			})
		}
	}
}