import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  public static readonly PAGES = [
    {
      path: 'search',
      display: 'Search',
      icon: 'search-circle-outline'
    },
    {
      path: 'mark',
      display: 'Mark',
      icon: 'pencil-outline'
    }
  ];

  public get pages() { return HomePage.PAGES; }
  public get authentication(): AuthenticationService { return this._authentication; }



  constructor(
    private _authentication: AuthenticationService,
  ) {}

}
