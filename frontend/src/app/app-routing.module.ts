import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppModule } from './app.module';
import { AppComponent } from './app.page';
import { NotFoundPage } from './not-found/not-found.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home-routing.module').then(m => m.HomeRoutingModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./user/user-routing.module').then(m => m.UserRoutingModule),
  },
  {
    path: 'songs',
    loadChildren: () => import('./song/song-routing.module').then(m => m.SongRoutingModule),
  },
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication-routing.module').then(m => m.AuthenticationRoutingModule),
  },
  {
    path: '**',
    component: NotFoundPage,
  }
];
@NgModule({
  imports: [
    AppModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [
    // ActivatedRoute
  ],
  bootstrap: [AppComponent],
})
export class AppRoutingModule {}
