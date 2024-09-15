import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Atualize a importação
import { LoginComponent } from './app/Login/login.component';
import { routes } from './app/app.routes';

bootstrapApplication(LoginComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // Atualize aqui
  ]
});

