import { Component } from '@angular/core';
import { SpotifyService } from '../spotify/spotify.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-spotify-search',
  templateUrl: './spotify-search.component.html',
  styleUrl: './spotify-search.component.scss'
})
export class SpotifySearchComponent {
	query: string = '';
	searchResults?: any[] = [];
  
	constructor(private spotifyService: SpotifyService) {}
  
	search(): void {
	//   this.spotifyService.search(this.query).subscribe(response => {
	// 	this.searchResults = response.tracks.items;
	//   });
	}
}
