import { Injectable } from "@angular/core";
import { SongService } from "./song.service";
import { Song } from "./song.model";
import { first } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class AllSongsProvider {

	public songs?: Song[] | null;

	constructor(
		private _songService: SongService
	) {
		this._songService.getSongs()
		  .pipe(first())
		  .subscribe(song => {
			this.songs = song instanceof HttpErrorResponse ? null : song;
		  });
	}
}