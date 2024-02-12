import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { SearchPage } from './search/search.page';
import { MarkPage } from './mark/mark.page';
import { HomeModule } from './home.module';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search-routing.module').then(m => m.SearchRoutingModule),
      },
      {
        path: 'create',
        component: MarkPage
      },
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    HomeModule,
    RouterModule.forChild(routes)
  ],
})
export class HomeRoutingModule {}
