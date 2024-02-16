import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistListComponent } from './playlist-list/playlist-list.component';
import { PlaylistPage } from './playlist-page/playlist.page';
import { PlaylistModule } from './playlist.module';

const routes: Routes = [
  {
    path: '',
    component: PlaylistListComponent,
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
