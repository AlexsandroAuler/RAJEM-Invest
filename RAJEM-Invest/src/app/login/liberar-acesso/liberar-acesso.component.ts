import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importando FormsModule
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-liberar-acesso',
  standalone: true,  // Habilitando standalone
  imports: [CommonModule, FormsModule], // Importando módulos necessários
  templateUrl: './liberar-acesso.component.html',
  styleUrls: ['./liberar-acesso.component.css']
})
export class LiberarAcessoComponent {
  email: string = '';
  token: string | null = null;

  constructor(private authService: AuthService) {}

  gotoGerarToken() {
    debugger;
    if (!this.email) {
      alert('Por favor, insira o email.');
      return;
    }

    this.authService.gerarToken(this.email).subscribe({
      next: (response) => {
        debugger;
        this.token = response.token; // Acessa a propriedade token do objeto recebido
        console.log('Email:', this.email);
        console.log('Token gerado:', this.token);
      },
      error: (err) => {
        console.error('Erro ao gerar o token:', err);
      }
    });    
  }
  copyToken() {
    if (this.token) {
      navigator.clipboard.writeText(this.token).then(() => {
        alert('Token copiado para a área de transferência!');
      }).catch(err => {
        console.error('Erro ao copiar o token:', err);
      });
    } else {
      alert('Nenhum token para copiar.');
    }
  }
}
