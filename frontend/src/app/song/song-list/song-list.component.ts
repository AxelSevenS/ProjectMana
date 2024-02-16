import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../song.model';
import { SongService } from '../song.service';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';
import { AllSongsProvider } from '../all-songs.provider';

@Component({
  selector: 'app-song-list',
  templateUrl: 'song-list.component.html',
  styleUrls: ['song-list.component.scss'],
})
export class SongListComponent implements OnInit {

  public get songs() { return this.inputSongs ?? this.songsProvider.songs };
  @Input({alias: 'songs'}) public inputSongs?: Song[] | null;

  constructor(
    private songsProvider: AllSongsProvider
  ) {}
  
  ngOnInit(): void {
  }

  onInfiniteScroll(event: Event) {
  }

}
