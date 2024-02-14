import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: 'user-list.page.html',
  styleUrls: ['user-list.page.scss'],
})
export class UserListPage implements OnInit {

  public get users() { return this._users }
  private _users?: User[] | null;

  constructor(
    private userService: UserService
  ) { }
  
  ngOnInit(): void {
    this.userService.getUsers()
      .pipe(first())
      .subscribe(users => {
        this._users = null;
        if (users instanceof HttpErrorResponse) return;
        
        this._users = users;
      });
  }

  onInfiniteScroll(event: Event) {
  }

}
