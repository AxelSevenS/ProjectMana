import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongModule } from 'src/app/song/song.module';
import { UserModule } from 'src/app/user/user.module';
import { PlaylistModule } from 'src/app/playlist/playlist.module';
import { CreateModule } from './create.module';
import { CreateSongPage } from './song/create-song.page';
import { CreatePage } from './create.page';
import { CreatePlaylistPage } from './playlist/create-playlist.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePage,
    children: [
      {
        path: '',
        redirectTo: 'songs',
        pathMatch: 'full'
      },
      {
        path: 'songs',
        component: CreateSongPage
      },
      {
        path: 'playlists',
        component: CreatePlaylistPage
      },
    ]
  }
];

@NgModule({
  imports: [
    SongModule,
    UserModule,
    PlaylistModule,
    CreateModule,
    RouterModule.forChild(routes)
  ],
})
export class CreateRoutingModule {}
