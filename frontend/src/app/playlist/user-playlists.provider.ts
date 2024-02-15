import { Injectable, OnInit } from "@angular/core";
import { PlaylistService } from "./playlist.service";
import { Playlist } from "./playlist.model";
import { first } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../authentication/authentication.service";

@Injectable({
	providedIn: 'root'
})
export class UserPlaylistsProvider {

	public get sortedPlaylists() { return this.playlists?.sort((p1,p2) => p1.id - p2.id) };
	public playlists?: Playlist[] | null;

	constructor(
		private _authentication: AuthenticationService,
		private _playlistService: PlaylistService
	) {
		if (this._authentication.user && ! this.playlists) {
		  this._playlistService.getPlaylistsByAuthorId(this._authentication.user.id)
			.pipe(first())
			.subscribe(res => {
			  if (res instanceof HttpErrorResponse) {
				this.playlists = null;
				return;
			  };
	  
			  this.playlists = res;
			})
		}
	}
}