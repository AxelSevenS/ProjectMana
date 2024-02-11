import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SongService } from 'src/app/song/song.service';

@Component({
  selector: 'app-mark',
  templateUrl: 'mark.page.html',
  styleUrls: ['mark.page.scss']
})
export class MarkPage {

  publishSongForm: FormGroup = this.formBuilder.group(
    {
      name: ['', Validators.required],
      description: ['', Validators.required],
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
      this.publishSongForm.controls['description'].value, 
      this.file
    )
      .subscribe(res => {
        if (res) {
          this.router.navigate(['/song', res.id]);
        }
      })
  }
}