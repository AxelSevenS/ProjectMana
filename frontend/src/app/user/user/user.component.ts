import { Component, Input, OnInit, numberAttribute } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  @Input({alias: 'user'}) public user?: User | null;

  @Input({alias: 'user-id', transform: numberAttribute}) public id?: number;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    if (this.id && ! this.user) {
      this.userService.getUserById(this.id)
        .subscribe(m => {
          this.user = m;
        })
    } else if (! this.id && this.user) {
      this.id = this.user.id;
    }
  }

}