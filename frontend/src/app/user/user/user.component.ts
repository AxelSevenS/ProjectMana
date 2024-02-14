import { Component, Input, OnInit, numberAttribute } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  @Input({alias: 'user'}) public user?: User | null;

  @Input({alias: 'user-id', transform: numberAttribute}) public id?: number;

  public get optionId() { return this._optionId};
  private _optionId = new Date().getTime().toString();

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    if (this.id && ! this.user) {
      this.userService.getUserById(this.id)
        .pipe(first())
        .subscribe(user => {
          if (user instanceof HttpErrorResponse) return;

          this.user = user;
        })
    } else if (! this.id && this.user) {
      this.id = this.user.id;
    }
  }

}