// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app/app.config';
import { AppModule } from './app/app.module';
import { AppComponent } from './app/app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// bootstrapApplication(AppModule, appConfig)
//   .catch((err) => console.error(err));

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));