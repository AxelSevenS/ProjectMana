import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserAuths } from '../user.model';
import { UserService } from '../user.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationValidators } from 'src/app/authentication/authentication-utility';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';

@Component({
  selector: 'app-password-edit',
  templateUrl: 'password-edit.page.html',
  styleUrls: ['password-edit.page.scss'],
})
export class PasswordEditPage {

  editUserForm: FormGroup = this.formBuilder.group(
    {
      password: ['', Validators.compose([Validators.required, AuthenticationValidators.securePasswordValidator])],
      passwordConfirm: ['', Validators.compose([Validators.required, AuthenticationValidators.securePasswordValidator])],
    }, 
    {
      validators: AuthenticationValidators.confirmPasswordValidator('password', 'passwordConfirm')
    }
  );

  public get authentication(): AuthenticationService { return this._authentication }
  public get requestId(): number { return this.activatedRoute.snapshot.params['id'] }

  public get user() { return this._user }
  private _user?: User | null;



  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private _authentication: AuthenticationService
  ) {}
  
  ngOnInit(): void {
  }

  onSubmit(): void {
    if ( ! this.authentication.user ) return;
    if ( ! this.editUserForm.valid ) return;

    let user = {
      password: this.editUserForm.controls['password'].value
    };

    this.userService.updateUserById(this.authentication.user.id, user)
      .subscribe(res => {
        if (res) {
          if (res instanceof HttpErrorResponse) return;

          this.authentication.login(res.username, user.password)
            .subscribe(() => {
              window.location.reload();
            });
        }
      });
  }

}
