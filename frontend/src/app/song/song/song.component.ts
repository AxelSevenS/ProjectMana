import { Component, Input, OnInit, numberAttribute } from '@angular/core';
import { SongService } from '../song.service';
import { Song } from '../song.model';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss'],
})
export class SongComponent implements OnInit {

  @Input({alias: 'song'}) public song?: Song | null;

  @Input({alias: 'song-id', transform: numberAttribute}) public id?: number;

  public get authentication() { return this._authentication }

  public get fileUrl() { return this._fileUrl }
  private _fileUrl: string | null = null;

  public get mimeType() { return this._mimeType }
  private _mimeType: string | null = null;

  constructor(
    private _authentication: AuthenticationService,
    private songService: SongService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    if (this.id && ! this.song) {
      this.songService.getSongById(this.id)
        .subscribe(song => {
          this.song = song;
          this.updateSongData();
        })
    } else if (! this.id && this.song) {
      this.id = this.song.id;
      this.updateSongData();
    }
  }

  private updateSongData() {
    this._fileUrl = this.song ? this.songService.getSongFileUrl(this.song) : null;
    this._mimeType = this.song ? this.songService.getSongMimeType(this.song) : null;
  }

  async delete() {
    if( ! this.song ) return;

    this.songService.deleteSongById(this.song.id)
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

}