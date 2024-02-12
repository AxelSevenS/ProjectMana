import { Component } from '@angular/core';

@Component({
	selector: 'app-create',
	templateUrl: 'create.page.html',
	styleUrls: ['create.page.scss'],
})
export class CreatePage {
	public static readonly PAGES = [
		{
			path: 'songs',
			display: 'Chansons',
			icon: 'play-outline'
		},
		{
			path: 'playlists',
			display: 'Playlists',
			icon: 'list-outline'
		},
	];

  public get pages() { return CreatePage.PAGES; }
}
