import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { PlaylistService } from '../playlist.service';
import { Playlist } from '../playlist.model';
import { AlertController } from '@ionic/angular';
import { SafeUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/user/user.service';
import { first } from 'rxjs';
import { AllPlaylistsProvider } from '../all-playlists.provider';
import { SongService } from 'src/app/song/song.service';

@Component({
  selector: 'app-playlist-page',
  templateUrl: 'playlist.page.html',
  styleUrls: ['playlist.page.scss'],
})
export class PlaylistPage {

  editPlaylistForm: FormGroup = this.formBuilder.group(
    {
      name: ['', Validators.required]
    }
  );

  public get authentication() { return this._authentication }

  public get requestId() { return this.activatedRoute.snapshot.params['id'] }

  public get playlist() { return this._playlist }
  private _playlist?: Playlist | null;



  constructor(
    private router: Router,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _playlistService: PlaylistService,
    private _authentication: AuthenticationService,
  ) {}
  
  ngOnInit(): void {
    this._playlistService.getPlaylistById(this.requestId)
      .subscribe(playlist => {
        if ( playlist instanceof HttpErrorResponse ) return;
        this._playlist = playlist;

        this.editPlaylistForm.controls['name'].setValue(playlist?.name);
      });

    this._playlistService.eventRemoved
      .subscribe(playlist => {
        if (this._playlist?.id != playlist.id) return;
        this._playlist = null;
      });
      
    this._playlistService.eventUpdated
      .subscribe(playlist => {
        if (this._playlist?.id != playlist.id) return;
        this._playlist = playlist;
      });
  }

  onSubmit(): void {
    if ( ! this.playlist ) return;
    if ( ! this.editPlaylistForm.valid ) return;

    let updated: Playlist = this.playlist;
    this.playlist.name = this.editPlaylistForm.controls['name'].value;

    this._playlistService.updatePlaylistById(this.playlist.id, updated);
  }

  async delete() {
    if( ! this.playlist ) return;

    this._playlistService.deletePlaylistById(this.playlist.id)
      .subscribe(async res => {
        if (res instanceof HttpErrorResponse) {
          const alert = await this.alertController.create({
            header: 'Erreur lors de la Suppression de la Playlist',
            message: `La suppression de la Playlist a échoué (erreur ${res.statusText})`,
            buttons: ['Ok'],
          });
          
          await alert.present();
          return;
        }
        
        this.router.navigate(['']);
      });
  }

}
