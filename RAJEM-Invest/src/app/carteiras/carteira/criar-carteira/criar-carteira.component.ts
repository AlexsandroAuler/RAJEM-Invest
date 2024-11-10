import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom} from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-criar-carteira',
  standalone: true,
  imports: [],
  templateUrl: './criar-carteira.component.html',
  styleUrl: './criar-carteira.component.css'
})
export class CriarCarteiraComponent {
  nomeCarteira: string = '';
  username : string = '';
  password: string = '';


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.adicionarCarteira();
    this.username = sessionStorage.getItem('email') || '';
  }

  async adicionarCarteira(): Promise<void> {
    try {
      debugger;
      const email = sessionStorage.getItem('email') as string;
      const nomeCarteira = (document.querySelector('.nomeCarteira') as HTMLInputElement).value;
      
      if (email && nomeCarteira) {
        // Faz a requisição para adicionar uma nova carteira
        const response = await firstValueFrom(this.authService.adicionarCarteira(email, nomeCarteira));
        
        if (response) { // Supondo que o backend retorna um campo `success` na resposta
          alert('Carteira Adicionada com sucesso!')
          sessionStorage.setItem('email', this.username);
          this.router.navigate(['/listar-carteira']);
          // Opcionalmente, você pode limpar o campo de entrada após a adição
          (document.querySelector('.nomeCarteira') as HTMLInputElement).value = '';
        } else {
          console.error('Erro ao adicionar carteira:');
        }
      } else {
        console.error('Email ou nome da carteira não fornecido');
      }
    } catch (erro) {
      console.error('Erro ao adicionar carteira:', erro);
    }
  }
  

  voltarCarteira(): void{
    this.router.navigate(['/listar-carteira']);
  }
  
  


  }


