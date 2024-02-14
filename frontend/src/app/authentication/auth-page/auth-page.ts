import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { AuthenticationValidators } from '../authentication-utility';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.html',
  styleUrls: ['./auth-page.scss'],
})

export class AuthPage implements OnInit {

  loginForm: FormGroup = this.formBuilder.group({
    username: ['', /* Validators.compose([ */Validators.required/* , Validators.username]) */],
    password: ['', Validators.required],
  });

  registerForm: FormGroup = this.formBuilder.group(
    {
      username: ['', /* Validators.compose([ */Validators.required, /* Validators.email]) */],
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
    this.authenticationService.login(this.loginForm.controls["username"].value, this.loginForm.controls["password"].value)
      .pipe(first())
      .subscribe(u => {
        if (u instanceof HttpErrorResponse) return;

        this.router.navigate([''])
          .then(() => window.location.reload())
      })
  }

  register() {
    let username = this.registerForm.controls["username"].value;
    let password = this.registerForm.controls["password"].value;
    this.authenticationService.register(username, password)
      .pipe(first())
      .subscribe(u => {
        if (u instanceof HttpErrorResponse) { return };

        this.authenticationService.login(username, password)
          .pipe(first())
          .subscribe(() => {
            this.router.navigate([''])
              .then(() => window.location.reload())
          })
      })
  }

}
