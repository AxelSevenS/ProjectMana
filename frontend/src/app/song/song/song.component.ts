import { Component, Input, OnInit, numberAttribute } from '@angular/core';
import { SongService } from '../song.service';
import { Song } from '../song.model';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { AlertController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';
import { PlaylistService } from 'src/app/playlist/playlist.service';
import { Playlist } from 'src/app/playlist/playlist.model';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss'],
})
export class SongComponent implements OnInit {

  @Input({alias: 'song'}) public song?: Song | null;

  @Input({alias: 'song-id', transform: numberAttribute}) public id?: number;

  public get optionId() { return this._optionId};
  private _optionId = new Date().getTime().toString();

  public get authentication() { return this._authentication }
  public get playlistService() { return this._playlistService }

  public get fileUrl() { return this._fileUrl }
  private _fileUrl?: string | null;

  constructor(
    private _authentication: AuthenticationService,
    private songService: SongService,
    private _playlistService: PlaylistService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    if (this.id && ! this.song) {
      this.songService.getSongById(this.id)
        .pipe(first())
        .subscribe(song => {
          if (song instanceof HttpErrorResponse) return;

          this.song = song;
          this._fileUrl = this.songService.getSongFileUrl(this.song);
        })
    } else if (! this.id && this.song) {

      this.id = this.song.id;
      this._fileUrl = this.songService.getSongFileUrl(this.song);
    }
  }

  async delete() {
    if( ! this.song ) return;

    this.songService.deleteSongById(this.song.id)
      .pipe(first())
      .subscribe(async res => {
        if (res) {
          this.song = undefined;
          return;
        }

        const alert = await this.alertController.create({
          header: 'Erreur lors de la Suppression du Média',
          message: 'La suppression du Média a échoué',
          buttons: ['Ok'],
        });
    
        await alert.present();
      });
  }

  togglePlaylist(e: any, playlist: Playlist) {
    // ion-checkbox's "checked" binding is reversed for some dumbass reason
    let isChecked: boolean = ! e.target.checked;

    if (isChecked) {
      this.playlistService.AddSongById(playlist.id, this.song!.id)
        .pipe(first())
        .subscribe(res => {
          if (res instanceof HttpErrorResponse) {
            e.target.checked = !isChecked;
            return;
          }
          
          let index = this.playlistService.userPlaylists?.findIndex(p => p.id == playlist.id) ?? -1;
          if (index != -1) {
            this.playlistService.userPlaylists![index] = playlist;
          }
        })
    } else {
      this.playlistService.removeSongById(playlist.id, this.song!.id)
        .pipe(first())
        .subscribe(res => {
          if (res instanceof HttpErrorResponse) {
            e.target.checked = !isChecked;
            return;
          }

          let index = this.playlistService.userPlaylists?.findIndex(p => p.id == playlist.id) ?? -1;
          if (index != -1) {
            this.playlistService.userPlaylists![index] = playlist;
          }
        })
    }
  }

  playlistContainsSong(playlist: Playlist, songId: number) {
    return playlist.songs.find(s => this.song && s.id === this.song.id) !== undefined;
  }

}