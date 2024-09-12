import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Importe as rotas definidas

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // Configura o roteamento
  ]
});

