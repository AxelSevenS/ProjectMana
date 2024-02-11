import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PlaylistListPage } from './playlist-list-page/playlist-list.page';
import { PlaylistPage } from './playlist-page/playlist.page';
import { PlaylistComponent } from './playlist/playlist.component';
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
  declarations: [PlaylistListPage, PlaylistPage, PlaylistComponent],
  exports: [PlaylistListPage, PlaylistPage, PlaylistComponent],
})
export class PlaylistModule {
}
