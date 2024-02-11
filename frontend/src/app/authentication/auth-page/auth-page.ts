import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { AuthenticationValidators } from '../authentication-utility';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.html',
  styleUrls: ['./auth-page.scss'],
})

export class AuthPage implements OnInit {

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', /* Validators.compose([ */Validators.required/* , Validators.email]) */],
    password: ['', Validators.required],
  });

  registerForm: FormGroup = this.formBuilder.group(
    {
      fullName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, AuthenticationValidators.securePasswordValidator])],
      passwordConfirm: ['', Validators.compose([Validators.required, AuthenticationValidators.securePasswordValidator])],
    }, {
      validators: [
        AuthenticationValidators.confirmPasswordValidator('password', 'passwordConfirm')
      ]
    }
  );

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {}

  login() {
    this.authenticationService.login(this.loginForm.controls["email"].value, this.loginForm.controls["password"].value)
      .subscribe(u => {
        if (u instanceof HttpErrorResponse) { return };

        this.router.navigate([''])
          .then(() => window.location.reload())
      })
  }

  register() {
    this.authenticationService.register(this.registerForm.controls["email"].value, this.registerForm.controls["password"].value)
      .subscribe(u => {
        if (u instanceof HttpErrorResponse) { return };

        this.router.navigate([''])
          .then(() => window.location.reload())
      })
  }

}
