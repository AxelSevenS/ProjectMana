import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './authentication/authentication.service';
import { NotFoundPage } from './not-found/not-found.page';

@NgModule({
  declarations: [AppComponent, NotFoundPage],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    IonicModule.forRoot()
  ],
  providers: [
    Storage,
    HttpClient,
    AuthenticationService,
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy
    }
  ]
})
export class AppModule {}
