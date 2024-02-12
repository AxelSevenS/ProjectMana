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
import { PasswordEditPage } from './password-edit-page/password-edit.page';

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
  declarations: [UserListPage, UserLibraryPage, UserPage, UserComponent, PasswordEditPage],
  exports: [UserListPage, UserLibraryPage, UserPage, UserComponent, PasswordEditPage]
})
export class UserModule {
}
