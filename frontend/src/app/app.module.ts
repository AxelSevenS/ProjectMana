import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { SpotifySearchComponent } from './spotify-search/spotify-search.component';
import { SpotifyService } from './spotify/spotify.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
	declarations: [
		AppComponent,
		SpotifySearchComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
		BrowserModule
	],
	exports: [
		AppComponent,
		SpotifySearchComponent
	],
	providers: [
		HttpClient,
		SpotifyService
	],
	bootstrap: [AppComponent],
  
})

export class AppModule { }
