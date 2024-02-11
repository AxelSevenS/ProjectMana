import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationModule } from './authentication.module';
import { AuthPage } from './auth-page/auth-page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: AuthPage
      },
    ]
  }
];

@NgModule({
  imports: [
    AuthenticationModule,
    RouterModule.forChild(routes)
  ],
})
export class AuthenticationRoutingModule {}
