import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dados-primeiro-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Adiciona FormsModule aqui para habilitar ngModel
  templateUrl: './dados-primeiro-login.component.html',
  styleUrls: ['./dados-primeiro-login.component.css']
})
export class DadosPrimeiroLoginComponent {
  emailRecuperacao: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  email : string = '';

  constructor(private authService: AuthService, private router: Router) {}

  enviarDados() {
    debugger;
    if (this.senha !== this.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }
    
    const dados = {
      emailRecuperacao: this.emailRecuperacao,
      senha: this.senha,
      confirmarSenha: this.confirmarSenha,
      email : sessionStorage.getItem('email')
    };

    this.authService.enviarDadosPrimeiroLogin(dados).subscribe({
      next: (response: any) => {
        alert('Informações salvas com sucesso.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Erro ao salvar as informações:', err);
        alert('Erro ao salvar as informações.');
      }
    });
  }
}
