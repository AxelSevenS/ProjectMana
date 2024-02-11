import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongListPage } from './song-list-page/song-list.page';
import { SongPage } from './song-page/song.page';
import { SongModule } from './song.module';

const routes: Routes = [
  {
    path: '',
    component: SongListPage,
  },
  {
    path: ':id',
    component: SongPage
  }
];

@NgModule({
  imports: [
    SongModule,
    RouterModule.forChild(routes)
  ],
})
export class SongRoutingModule {}
