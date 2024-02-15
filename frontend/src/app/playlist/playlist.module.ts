import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PlaylistListComponent } from './playlist-list/playlist-list.component';
import { PlaylistPage } from './playlist-page/playlist.page';
import { PlaylistComponent } from './playlist/playlist.component';
import { RouterModule } from '@angular/router';
import { PlaylistService } from './playlist.service';
import { AllPlaylistsProvider } from './all-playlists.provider';
import { SongModule } from '../song/song.module';
import { UserPlaylistsProvider } from './user-playlists.provider';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SongModule
  ],
  providers: [PlaylistService, AllPlaylistsProvider, UserPlaylistsProvider],
  declarations: [PlaylistListComponent, PlaylistPage, PlaylistComponent],
  exports: [PlaylistListComponent, PlaylistComponent],
})
export class PlaylistModule {
}
