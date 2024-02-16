import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserPage } from './user-page/user.page';
import { UserModule } from './user.module';
import { UserLibraryPage } from './user-library-page/user-library.page';
import { PasswordEditPage } from './password-edit-page/password-edit.page';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
  },
  {
    path: 'password',
    component: PasswordEditPage
  },
  {
    path: ':id',
    component: UserPage
  },
  {
    path: 'library/:id',
    component: UserLibraryPage
  }
];

@NgModule({
  imports: [
    UserModule,
    RouterModule.forChild(routes)
  ]
})
export class UserRoutingModule {}
