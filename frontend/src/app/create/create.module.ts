import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { CreatePage } from './create.page';
import { CreateSongPage } from './song/create-song.page';
import { CreatePlaylistPage } from './playlist/create-playlist.page';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule.forRoot()
  ],
  declarations: [CreatePage, CreateSongPage, CreatePlaylistPage],
  exports: [CreatePage, CreateSongPage, CreatePlaylistPage]
})
export class CreateModule {
}
