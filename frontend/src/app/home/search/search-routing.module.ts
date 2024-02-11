import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPage } from './search.page';
import { SongListPage } from 'src/app/song/song-list-page/song-list.page';
import { UserListPage } from 'src/app/user/user-list-page/user-list.page';
import { SongModule } from 'src/app/song/song.module';
import { UserModule } from 'src/app/user/user.module';
import { PlaylistListPage } from 'src/app/playlist/playlist-list-page/playlist-list.page';
import { PlaylistModule } from 'src/app/playlist/playlist.module';

const routes: Routes = [
  {
    path: '',
    component: SearchPage,
    children: [
      {
        path: '',
        redirectTo: 'songs',
        pathMatch: 'full'
      },
      {
        path: 'songs',
        component: SongListPage
      },
      {
        path: 'users',
        component: UserListPage
      },
      {
        path: 'playlists',
        component: PlaylistListPage
      },
    ]
  }
];

@NgModule({
  imports: [
    SongModule,
    UserModule,
    PlaylistModule,
    RouterModule.forChild(routes)
  ],
})
export class SearchRoutingModule {}
