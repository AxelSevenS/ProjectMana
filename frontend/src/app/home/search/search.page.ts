import { Component } from '@angular/core';

@Component({
	selector: 'app-search',
	templateUrl: 'search.page.html',
	styleUrls: ['search.page.scss'],
})
export class SearchPage {
	public static readonly PAGES = [
		{
			path: 'songs',
			display: 'Chansons',
			icon: 'play-outline'
		},
		{
			path: 'users',
			display: 'Utilisateurs',
			icon: 'person-outline'
		},
		{
			path: 'playlists',
			display: 'Playlists',
			icon: 'list-outline'
		},
	];

  public get pages() { return SearchPage.PAGES; }
}
