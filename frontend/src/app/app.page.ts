import { Component } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.page.html',
  styleUrls: ['app.page.scss'],
})
export class AppComponent {
  public get authentication(): AuthenticationService { return this._authentication; }

  
	constructor(
    private _authentication: AuthenticationService
	) {}
}
