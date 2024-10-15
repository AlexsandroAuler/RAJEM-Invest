import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-login',
  standalone: true,  // Habilitando standalone
  imports: [FormsModule, CommonModule],
  templateUrl: './index-login.component.html',
  styleUrls: ['./index-login.component.css']
})
export class IndexLoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  // Função para navegar até "primeiro-login"
  goToPrimeiroLogin() {
    this.router.navigate(['/primeiro-login']);
  }

  // Função de login
  gotoLogin() {
    // Lógica existente de navegação para "liberar-acesso" com email específico
    debugger;
    
    if (this.username === 'analista@rajem.com.br') {
      if (this.password === 'analista@rajem.com.br') {  // Verifica se a senha foi inserida
        sessionStorage.setItem('token', this.password); // Armazena o token
        sessionStorage.setItem('email', this.username); // Armazena o email inserido
        this.router.navigate(['/liberar-acesso']);
      } else {
        alert('Por favor, insira sua senha');
      }
    } else {
      alert('Acesso negado. Informe o email e senha corretos.');
    }
  }
}



