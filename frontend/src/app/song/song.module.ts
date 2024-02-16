import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SongListComponent } from './song-list/song-list.component';
import { SongPage } from './song-page/song.page';
import { SongComponent } from './song/song.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [SongListComponent, SongPage, SongComponent],
  exports: [SongListComponent, SongComponent],
})
export class SongModule {
}
