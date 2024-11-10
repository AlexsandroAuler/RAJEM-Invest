import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PrimeiroLoginComponent } from './login/primeiro-login/primeiro-login.component';
import { DadosPrimeiroLoginComponent } from './login/dados-primeiro-login/dados-primeiro-login.component';
import { LiberarAcessoComponent } from './login/liberar-acesso/liberar-acesso.component';
import { CriarCarteiraComponent } from './carteiras/carteira/criar-carteira/criar-carteira.component';
import { EditarCarteiraComponent } from './carteiras/carteira/editar-carteira/editar-carteira.component';
import { ListCarteirasComponent } from './carteiras/carteira/list-carteiras/list-carteiras.component';
import { authGuard } from './guards/auth.guard';



export const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'primeiro-login', component: PrimeiroLoginComponent },
  { path: 'dados-primeiro-login', component: DadosPrimeiroLoginComponent, canActivate: [authGuard] },
  { path: 'liberar-acesso', component: LiberarAcessoComponent, canActivate: [authGuard] },
  { path: 'editar-carteira/:id', component: EditarCarteiraComponent },
  { path: 'listar-carteira', component: ListCarteirasComponent, canActivate: [authGuard] },
  { path: 'criar-carteira', component: CriarCarteiraComponent,canActivate: [authGuard] }
];