import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { first } from 'rxjs';
import { PlaylistService } from 'src/app/playlist/playlist.service';

@Component({
  selector: 'app-create-playlist',
  templateUrl: 'create-playlist.page.html',
  styleUrls: ['create-playlist.page.scss']
})
export class CreatePlaylistPage {

  publishPlaylistForm: FormGroup = this.formBuilder.group(
    {
      name: ['', Validators.required],
    }
  );



  constructor(
    private router: Router,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private playlistService: PlaylistService
  ) {}
  
  ngOnInit(): void {
  }

  onSubmit(): void {
    if ( ! this.publishPlaylistForm.valid ) return;

    this.playlistService.createPlaylist(
      this.publishPlaylistForm.controls['name'].value, 
    )
      .subscribe(playlist => {
        if (playlist instanceof HttpErrorResponse) return;
        
        this.router.navigate(['/playlists', playlist.id]);
      })
  }
}