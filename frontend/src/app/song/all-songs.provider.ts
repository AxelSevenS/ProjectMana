import { Injectable } from "@angular/core";
import { SongService } from "./song.service";
import { Song } from "./song.model";
import { first } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class AllSongsProvider {

	public get songs() { return this._songs };
	private _songs?: Song[] | null;

	constructor(
		private _songService: SongService
	) {
		this._songService.getSongs()
			.subscribe(song => {
				this._songs = song instanceof HttpErrorResponse ? null : song;
			});
		
		this._songService.eventAdded
			.subscribe(song => {
				this._songs?.push(song);
			});

		this._songService.eventRemoved
			.subscribe(song => {
				if ( ! this._songs ) return;
				let index = this._songs?.findIndex(s => s.id == song.id);
				this._songs?.splice(index, 1);
			});
			
			this._songService.eventUpdated
			.subscribe(song => {
				if ( ! this._songs ) return;
				let index = this._songs?.findIndex(s => s.id == song.id);
				this._songs?.splice(index, 1, song);
			});
	}
}