import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: 'user-list.page.html',
  styleUrls: ['user-list.page.scss'],
})
export class UserListPage implements OnInit {

  public get users(): User[] { return this._users }
  private _users: User[] = []

  constructor(
    private userService: UserService
  ) { }
  
  ngOnInit(): void {
    this.userService.getUsers()
      .subscribe(u => this._users = u);
  }

  onInfiniteScroll(event: Event) {
  }

}
