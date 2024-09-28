import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PrimeiroLoginComponent } from './login/primeiro-login/primeiro-login.component';
import { DadosPrimeiroLoginComponent } from './login/dados-primeiro-login/dados-primeiro-login.component';
import { LiberarAcessoComponent } from './login/liberar-acesso/liberar-acesso.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent, // Componente principal de login
  },
  {
    path: 'primeiro-login',
    component: PrimeiroLoginComponent, // Rota para o componente "Primeiro Login"
  },
  {
    path: 'dados-primeiro-login',
    component: DadosPrimeiroLoginComponent, // Rota para o componente "Dados do Primeiro Login"
  },
  {
    path: 'liberar-acesso',
    component: LiberarAcessoComponent, // Rota para o componente "Liberar Acesso"
  },
  { 
    path: '', redirectTo: 'index-login', pathMatch: 'full' }, // Redireciona para login
  { 
    path: '**', redirectTo: 'index-login' }, // Redireciona caso a rota não exista
];