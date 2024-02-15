import { Injectable, OnInit } from "@angular/core";
import { PlaylistService } from "./playlist.service";
import { Playlist } from "./playlist.model";
import { first } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class AllPlaylistsProvider {

	public get playlists() { return this._playlists };
	private _playlists?: Playlist[] | null;

	constructor(
		private _playlistService: PlaylistService
	) {
		this._playlistService.getPlaylists()
		  .subscribe(playlist => {
				this._playlists = playlist instanceof HttpErrorResponse ? null : playlist;
		  });
		
		this._playlistService.eventAdded
			.subscribe(playlist => {
				this._playlists?.push(playlist);
			});

		this._playlistService.eventRemoved
			.subscribe(playlist => {
				if ( ! this._playlists ) return;
				let index = this._playlists?.findIndex(s => s.id == playlist.id);
				this._playlists?.splice(index, 1);
			});
			  
		this._playlistService.eventUpdated
		.subscribe(playlist => {
			if ( ! this._playlists ) return;
			let index = this._playlists?.findIndex(s => s.id == playlist.id);
			this._playlists?.splice(index, 1, playlist);
		});
	}
}