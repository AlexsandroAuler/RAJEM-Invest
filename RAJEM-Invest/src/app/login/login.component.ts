import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexLoginComponent } from './index-login/index-login.component';

@Component({
  selector: 'app-login',
  standalone: true,  // Habilitando standalone
  imports: [CommonModule, IndexLoginComponent], // Importando IndexLoginComponent
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router) { }

  // Função para navegar até "primeiro-login"
  ValidarToken() {
    this.router.navigate(['/primeiro-login']);
  }
}
