import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserListComponent } from './user-list/user-list.component';
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
  declarations: [UserListComponent, UserLibraryPage, UserPage, UserComponent, PasswordEditPage],
  exports: [UserListComponent, UserComponent]
})
export class UserModule {
}
