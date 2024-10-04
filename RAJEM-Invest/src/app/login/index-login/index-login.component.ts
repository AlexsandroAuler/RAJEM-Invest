import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-login',
  standalone: true,  // Habilitando standalone
  imports : [FormsModule, CommonModule],
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
  gotoLogin() {
    // Lógica para fazer login (pode incluir autenticação)

    if (this.username === 'rodrigo' && this.password.trim() === ''){
      this.router.navigate(['/liberar-acesso']);
    }else{
      alert('Informe Login e senha')
    }
  }
}


