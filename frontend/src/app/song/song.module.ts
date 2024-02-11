import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SongListPage } from './song-list-page/song-list.page';
import { SongPage } from './song-page/song.page';
import { SongComponent } from './song/song.component';
import { RouterModule } from '@angular/router';
import { NgLetModule } from 'ng-let';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    QRCodeModule,
    ReactiveFormsModule,
    NgLetModule,
    FormsModule
  ],
  declarations: [SongListPage, SongPage, SongComponent],
  exports: [SongListPage, SongPage, SongComponent],
})
export class SongModule {
}
