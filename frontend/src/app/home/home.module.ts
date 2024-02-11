import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { SongModule } from '../song/song.module';
import { SearchPage } from './search/search.page';
import { MarkPage } from './mark/mark.page';
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [
    RouterLink,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    SongModule
  ],
  declarations: [HomePage, SearchPage, MarkPage]
})
export class HomeModule {
}
