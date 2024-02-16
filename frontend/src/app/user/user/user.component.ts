import { Component, Input, OnInit, numberAttribute } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  @Input({alias: 'user'}) public user?: User | null;

  @Input({alias: 'user-id', transform: numberAttribute}) public id?: number;

  public get authentication() { return this._authentication };

  public get optionId() { return this._optionId };
  private _optionId = new Date().getTime().toString();

  constructor(
    private _authentication: AuthenticationService,
    private userService: UserService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    if (this.id && ! this.user) {
      this.userService.getUserById(this.id)
        .subscribe(user => {
          if (user instanceof HttpErrorResponse) return;

          this.user = user;
        })
    } else if (! this.id && this.user) {
      this.id = this.user.id;
    }

    this.userService.eventRemoved
      .subscribe(user => {
        if (this.user?.id != user.id) return;
        this.user = null;
      });
      
    this.userService.eventUpdated
      .subscribe(user => {
        if (this.user?.id != user.id) return;
        this.user = user;
      });
  }

  async delete() {
    if( ! this.user ) return;

    this.userService.deleteUserById(this.user.id)
      .subscribe(async res => {
        if (res instanceof HttpErrorResponse) {
          const alert = await this.alertController.create({
            header: 'Erreur lors de la Suppression de l\'Utilisateur',
            message: 'La suppression de l\'Utilisateur a échoué',
            buttons: ['Ok'],
          });
          
          await alert.present();
          return;
        }
      });
  }

}