import { Component } from '@angular/core';
import { AllPlaylistsProvider } from '../all-playlists.provider';

@Component({
  selector: 'app-playlist-list',
  templateUrl: 'playlist-list.component.html',
  styleUrls: ['playlist-list.component.scss'],
})
export class PlaylistListComponent {

  public get playlistProvider() { return this._playlistProvider };

  constructor(
    private _playlistProvider: AllPlaylistsProvider
  ) {}

  onInfiniteScroll(event: Event) {
  }

}
