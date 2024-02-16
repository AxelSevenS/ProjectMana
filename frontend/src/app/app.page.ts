import { Component } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.page.html',
  styleUrls: ['app.page.scss'],
})
export class AppComponent {
  public get authentication(): AuthenticationService { return this._authentication; }

  public static readonly PAGES = [
    {
      path: 'search',
      display: 'Rechercher',
      icon: 'search-outline'
    },
    {
      path: 'create',
      display: 'Créer',
      icon: 'pencil-outline'
    }
  ];

  public get pages() { return AppComponent.PAGES; }
  
	constructor(
    private _authentication: AuthenticationService
	) {}
}
