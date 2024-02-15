import { Injectable, OnInit } from "@angular/core";
import { PlaylistService } from "./playlist.service";
import { Playlist } from "./playlist.model";
import { first } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class AllPlaylistsProvider {

	public playlists?: Playlist[] | null;

	constructor(
		private _playlistService: PlaylistService
	) {
		this._playlistService.getPlaylists()
		  .pipe(first())
		  .subscribe(playlist => {
			this.playlists = playlist instanceof HttpErrorResponse ? null : playlist;
		  });
	}
}