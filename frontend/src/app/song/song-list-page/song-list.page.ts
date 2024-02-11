import { Component, OnInit } from '@angular/core';
import { Song } from '../song.model';
import { SongService } from '../song.service';

@Component({
  selector: 'app-song-list',
  templateUrl: 'song-list.page.html',
  styleUrls: ['song-list.page.scss'],
})
export class SongListPage implements OnInit {

  public get songs(): Song[] { return this._songs }
  private _songs: Song[] = []

  constructor(
    private songService: SongService
  ) { }
  
  ngOnInit(): void {
    this.songService.getSongs()
      .subscribe(u => this._songs = u);
  }

  onInfiniteScroll(event: Event) {
  }

}
