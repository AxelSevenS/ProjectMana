import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistListPage } from './playlist-list-page/playlist-list.page';
import { PlaylistPage } from './playlist-page/playlist.page';
import { PlaylistModule } from './playlist.module';

const routes: Routes = [
  {
    path: '',
    component: PlaylistListPage,
  },
  {
    path: ':id',
    component: PlaylistPage
  }
];

@NgModule({
  imports: [
    PlaylistModule,
    RouterModule.forChild(routes)
  ],
})
export class PlaylistRoutingModule {}
