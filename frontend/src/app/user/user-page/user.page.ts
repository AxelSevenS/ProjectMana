import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserAuths } from '../user.model';
import { UserService } from '../user.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-user-page',
  templateUrl: 'user.page.html',
  styleUrls: ['user.page.scss'],
})
export class UserPage {

  editUserForm: FormGroup = this.formBuilder.group(
    {
      username: ['', Validators.required],
      roles: []
    }
  );

  public get authentication(): AuthenticationService { return this._authentication }
  public get requestId(): number { return this.activatedRoute.snapshot.params['id'] }

  public get user() { return this._user }
  private _user?: User | null;

  public get auths() { return this._auths }
  private _auths: UserAuths = this.userService.getAuths(undefined);



  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private _authentication: AuthenticationService,
    private alertController: AlertController,
  ) {}
  
  ngOnInit(): void {
    this.userService.getUserById(this.requestId)
      .subscribe(user => {
        if (user instanceof HttpErrorResponse) return;

        this._user = user;
        this._auths = this.userService.getAuths(this._user.roles);

        this.editUserForm.controls['username'].setValue(this._user.username);
        this.editUserForm.controls['roles'].setValue(this.userService.getRolesList(this._auths));
      });

    this.userService.eventRemoved
      .subscribe(user => {
        if (this._user?.id != user.id) return;
        this._user = null;
      });
      
    this.userService.eventUpdated
      .subscribe(user => {
        if (this._user?.id != user.id) return;
        this._user = user;
      });
  }

  onSubmit(): void {
    if ( ! this.user ) return;
    if ( ! this.editUserForm.valid ) return;

    let updated = {
      username: this.editUserForm.controls['username'].value,
      roles: this.editUserForm.controls['roles'].value.join(',')
    };

    this.userService.updateUserById(this.requestId, updated)
      .subscribe(async res => {
        if (res instanceof HttpErrorResponse) {
          const alert = await this.alertController.create({
            header: 'Erreur lors de la Modification de l\'Utilisateur',
            message: `La modification de l\'Utilisateur à échoué (erreur ${res.statusText})`,
            buttons: ['Ok'],
          });
          
          await alert.present();
          return;
        }

        if (this.requestId == this.authentication.user?.id && this.user?.username != updated.username) {
          this.authentication.logout();
          this.router.navigate(['/authentication/login']);
        }
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
