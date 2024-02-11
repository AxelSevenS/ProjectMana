import { Component, OnInit } from '@angular/core';
import { Song } from '../song.model';
import { SongService } from '../song.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-song-list',
  templateUrl: 'song-list.page.html',
  styleUrls: ['song-list.page.scss'],
})
export class SongListPage implements OnInit {

  public get songs() { return this._songs }
  private _songs?: Song[] | null;

  constructor(
    private songService: SongService
  ) { }
  
  ngOnInit(): void {
    this.songService.getSongs()
      .subscribe(songs => {
        this._songs = null;
        if (songs instanceof HttpErrorResponse) return;
        
        this._songs = songs;
      });
  }

  onInfiniteScroll(event: Event) {
  }

}
