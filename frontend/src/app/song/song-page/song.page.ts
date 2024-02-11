import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { SongService } from '../song.service';
import { Song } from '../song.model';
import { AlertController } from '@ionic/angular';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-song-page',
  templateUrl: 'song.page.html',
  styleUrls: ['song.page.scss'],
})
export class SongPage {

  editSongForm: FormGroup = this.formBuilder.group(
    {
      name: ['', Validators.required],
      description: ['', Validators.required]
    }
  );

  public get songService() { return this._songService }
  public get authentication() { return this._authentication }

  public get isOwner() { return this._authentication.user?.id == this.song?.authorId }
  public get isAdmin() { return this._authentication.user?.roles == "Admin" }
  public get requestId() { return this.activatedRoute.snapshot.params['id'] }

  public get qrCodeDownloadLink() { return this._qrCodeDownloadLink }
  private _qrCodeDownloadLink: SafeUrl = "";

  public get song() { return this._song }
  private _song?: Song | null;

  public get fileUrl() { return this._fileUrl }
  private _fileUrl: string | null = null;

  public get mimeType() { return this._mimeType }
  private _mimeType: string | null = null;



  constructor(
    private router: Router,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _songService: SongService,
    private _authentication: AuthenticationService
  ) {}
  
  ngOnInit(): void {
    this._songService.getSongById(this.requestId)
      .subscribe(song => {
        this._song = song;
        if ( ! this._song ) return;

        this._fileUrl = this.songService.getSongFileUrl(this._song);
        this._mimeType = this.songService.getSongMimeType(this._song);

        this.editSongForm.controls['name'].setValue(song?.name);
        this.editSongForm.controls['description'].setValue(song?.description);
      });
  }
  
  onChangeURL(url: SafeUrl) {
    this._qrCodeDownloadLink = url;
  }

  onSubmit(): void {
    if ( ! this.song ) return;
    if ( ! this.editSongForm.valid ) return;

    let updated: Song = this.song;
    this.song.name = this.editSongForm.controls['name'].value;
    this.song.description = this.editSongForm.controls['description'].value;

    this.songService.updateSongById(this.song.id, updated);
  }

  async delete() {
    if( ! this.song ) return;

    this._songService.deleteSongById(this.song.id)
      .subscribe(async res => {
        if (res) {
          this.router.navigate(['']);
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
