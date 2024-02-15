import { Component, Input, OnInit, numberAttribute } from '@angular/core';
import { PlaylistService } from '../playlist.service';
import { Playlist } from '../playlist.model';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { AlertController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {

  @Input({alias: 'playlist'}) public playlist?: Playlist | null;

  @Input({alias: 'playlist-id', transform: numberAttribute}) public id?: number;

  public get optionId() { return this._optionId};
  private _optionId = new Date().getTime().toString();

  public get authentication() { return this._authentication }

  public get fileUrl() { return this._fileUrl }
  private _fileUrl: string | null = null;

  public get mimeType() { return this._mimeType }
  private _mimeType: string | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private _authentication: AuthenticationService,
    private playlistService: PlaylistService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    if (this.id && ! this.playlist) {
      this.playlistService.getPlaylistById(this.id)
        .pipe(first())
        .subscribe(playlist => {
          if (playlist instanceof HttpErrorResponse) return;

          this.playlist = playlist;
        })
    } else if (! this.id && this.playlist) {
      this.id = this.playlist.id;
    }
  }

  async delete() {
    if( ! this.playlist ) return;

    this.playlistService.deletePlaylistById(this.playlist.id)
      .pipe(first())
      .subscribe(async res => {
        if (res instanceof HttpErrorResponse) {
          const alert = await this.alertController.create({
            header: 'Erreur lors de la Suppression de la Playlist',
            message: `La suppression de la Playlist a échoué (erreur ${res.status})`,
            buttons: ['Ok'],
          });
          
          await alert.present();
          return;
        }

        this.playlist = undefined;
      });
    }

}