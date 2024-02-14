import { Component, OnInit } from '@angular/core';
import { Playlist } from '../playlist.model';
import { PlaylistService } from '../playlist.service';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';

@Component({
  selector: 'app-playlist-list',
  templateUrl: 'playlist-list.page.html',
  styleUrls: ['playlist-list.page.scss'],
})
export class PlaylistListPage implements OnInit {

  public get playlists() { return this._playlists }
  private _playlists?: Playlist[] | null;

  constructor(
    private playlistService: PlaylistService
  ) { }
  
  ngOnInit(): void {
    this.playlistService.getPlaylists()
      .pipe(first())
      .subscribe(playlist => {
        this._playlists = null;
        if (playlist instanceof HttpErrorResponse) return;
        
        this._playlists = playlist
      });
  }

  onInfiniteScroll(event: Event) {
  }

}
