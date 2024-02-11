import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationValidators } from 'src/app/authentication/authentication-utility';

@Component({
  selector: 'app-user-page',
  templateUrl: 'user.page.html',
  styleUrls: ['user.page.scss'],
})
export class UserPage {

  editUserForm: FormGroup = this.formBuilder.group(
    {
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, AuthenticationValidators.securePasswordValidator])],
      passwordConfirm: ['', Validators.compose([Validators.required, AuthenticationValidators.securePasswordValidator])],
      roles: ['']
    }, 
    {
      validators: AuthenticationValidators.confirmPasswordValidator('password', 'passwordConfirm')
    }
  );

  public get authentication(): AuthenticationService { return this._authentication }

  public get isOwner(): boolean { return this._authentication.user?.id == this.requestId }
  public get isAdmin(): boolean { return this._authentication.user?.roles == "Admin" }
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
    this.userService.getUserById(this.requestId)
      .subscribe(user => {
        this._user = user;
        if ( ! this._user ) return;

        this.editUserForm.controls['username'].setValue(this._user.username);
        this.editUserForm.controls['roles'].setValue(this._user.roles);
      });
  }

  onSubmit(): void {
    if ( ! this.user ) return;
    if ( ! this.editUserForm.valid ) return;

    let updated: User = this.user;

    this.user.username = this.editUserForm.controls['username'].value;
    this.user.password = this.editUserForm.controls['password'].value;
    this.user.roles = this.editUserForm.controls['roles'].value;

    this.userService.updateUserById(this.requestId, updated)
      .subscribe(res => {
        if (res && this.requestId == this.authentication.user?.id) {
          this.authentication.logout();
          this.router.navigate(['/authentication/login']);
        }
      });
  }

}
