import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserListPage } from './user-list-page/user-list.page';
import { UserPage } from './user-page/user.page';
import { UserService } from './user.service';
import { UserComponent } from './user/user.component';
import { RouterLink } from '@angular/router';
import { UserLibraryPage } from './user-library-page/user-library.page';
import { SongModule } from '../song/song.module';

@NgModule({
  imports: [
    RouterLink,
    IonicModule,
    CommonModule,
    FormsModule,
    SongModule,
    ReactiveFormsModule,
  ],
  providers: [UserService],
  declarations: [UserListPage, UserLibraryPage, UserPage, UserComponent],
  exports: [UserListPage, UserLibraryPage, UserPage, UserComponent]
})
export class UserModule {
}
