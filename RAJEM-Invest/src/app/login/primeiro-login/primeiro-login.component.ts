import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primeiro-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './primeiro-login.component.html',
  styleUrls: ['./primeiro-login.component.css']
})
export class PrimeiroLoginComponent {
  email: string = '';
  token: string = '';
  isValidToken: boolean | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  validarToken() {
    if (!this.email || !this.token) {
      alert('Por favor, insira o email e o token.');
      return;
    }

    this.authService.validarToken(this.email, this.token).subscribe({
      next: (isValid) => {
      debugger;
        this.isValidToken = true; // Armazena o valor booleano recebido
        if (this.isValidToken) {
          // Redirecionar para a rota dados-primeiro-login
          this.router.navigate(['/dados-primeiro-login']);
        } else {
          alert('Token inválido.'); // Mensagem de erro se o token for inválido
        }
      },
      error: (err) => {
        console.error('Erro ao validar o token:', err);
      }
    });
  }
}

