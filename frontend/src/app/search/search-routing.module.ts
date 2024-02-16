import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPage } from './search.page';
import { SongListComponent } from 'src/app/song/song-list/song-list.component';
import { UserListComponent } from 'src/app/user/user-list/user-list.component';
import { SongModule } from 'src/app/song/song.module';
import { UserModule } from 'src/app/user/user.module';
import { PlaylistListComponent } from 'src/app/playlist/playlist-list/playlist-list.component';
import { PlaylistModule } from 'src/app/playlist/playlist.module';
import { SearchModule } from './search.module';

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
        component: SongListComponent
      },
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path: 'playlists',
        component: PlaylistListComponent
      },
    ]
  }
];

@NgModule({
  imports: [
    SongModule,
    UserModule,
    PlaylistModule,
    SearchModule,
    RouterModule.forChild(routes)
  ],
})
export class SearchRoutingModule {}
