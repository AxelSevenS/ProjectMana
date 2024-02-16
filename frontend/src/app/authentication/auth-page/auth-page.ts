import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { AuthenticationValidators } from '../authentication-utility';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs';
import { AlertController } from '@ionic/angular';

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
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {}

  login() {
    this.authenticationService.login(this.loginForm.controls["username"].value, this.loginForm.controls["password"].value)
      .subscribe(async res => {
        if (res instanceof HttpErrorResponse) {
          const alert = await this.alertController.create({
            header: 'Erreur lors de la Connexion',
            message: `La Connexion a échoué (erreur ${res.statusText})`,
            buttons: ['Ok'],
          });
          
          await alert.present();
          return;
        }

        this.router.navigate([''])
          .then(() => window.location.reload())
      })
  }

  register() {
    let username = this.registerForm.controls["username"].value;
    let password = this.registerForm.controls["password"].value;
    this.authenticationService.register(username, password)
      .subscribe(async res => {
        if (res instanceof HttpErrorResponse) {
          const alert = await this.alertController.create({
            header: 'Erreur lors de l\'Inscription',
            message: `L\'Inscription a échoué (erreur ${res.statusText})`,
            buttons: ['Ok'],
          });
          
          await alert.present();
          return;
        }

        this.authenticationService.login(username, password)
          .subscribe(() => {
            this.router.navigate([''])
              .then(() => window.location.reload())
          })
      })
  }

}
