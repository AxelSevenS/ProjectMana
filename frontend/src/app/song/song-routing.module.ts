import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { SongPage } from './song-page/song.page';
import { SongModule } from './song.module';

const routes: Routes = [
  {
    path: '',
    component: SongListComponent,
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
