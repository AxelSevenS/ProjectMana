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

	public get playlists() { return this._playlists };
	private _playlists?: Playlist[] | null;

	constructor(
		private _authentication: AuthenticationService,
		private _playlistService: PlaylistService
	) {
		if (this._authentication.user && ! this.playlists) {
		  this._playlistService.getPlaylistsByAuthorId(this._authentication.user.id)
			.subscribe(res => {
			  if (res instanceof HttpErrorResponse) {
				this._playlists = null;
				return;
			  };
	  
			  this._playlists = res;
			})
		}
		
		this._playlistService.eventAdded
			.subscribe(playlist => {
				if (playlist.authorId != this._authentication.user?.id) return;
				this._playlists?.push(playlist);
			});

		this._playlistService.eventRemoved
			.subscribe(playlist => {
				if ( ! this._playlists || playlist.authorId != this._authentication.user?.id ) return;
				let index = this._playlists?.findIndex(s => s.id == playlist.id);
				this._playlists?.splice(index, 1);
			});

		this._playlistService.eventUpdated
			.subscribe(playlist => {
				if ( ! this._playlists || playlist.authorId != this._authentication.user?.id ) return;
				let index = this._playlists?.findIndex(s => s.id == playlist.id);
				this._playlists?.splice(index, 1, playlist);
			});
	}
}