import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { first } from 'rxjs';
import { SongService } from 'src/app/song/song.service';

@Component({
  selector: 'app-create-song',
  templateUrl: 'create-song.page.html',
  styleUrls: ['create-song.page.scss']
})
export class CreateSongPage {

  publishSongForm: FormGroup = this.formBuilder.group(
    {
      name: ['', Validators.required],
      file: [null, Validators.required]
    }
  );

  private file?: File;



  constructor(
    private router: Router,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private songService: SongService
  ) {}
  
  ngOnInit(): void {
  }
  
  setImage(_event: any) {
    this.file = _event.target.files![0];
  }

  onSubmit(): void {
    if ( ! this.file ) return;
    if ( ! this.publishSongForm.valid ) return;

    this.songService.createSong(
      this.publishSongForm.controls['name'].value, 
      this.file
    )
      .subscribe(async res => {
        if (res instanceof HttpErrorResponse) {
          const alert = await this.alertController.create({
            header: 'Erreur lors de la Création de Chanson',
            message: `La Création de Chanson a échoué (erreur ${res.statusText})`,
            buttons: ['Ok'],
          });
          
          await alert.present();
          return;
        }
        
        this.router.navigate(['/songs', res.id]);
      })
  }
}