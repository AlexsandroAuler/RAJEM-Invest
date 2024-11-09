import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom} from 'rxjs';
import { CommonModule } from '@angular/common'; // Importa o CommonModule


@Component({
  selector: 'app-list-carteiras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-carteiras.component.html',
  styleUrls: ['./list-carteiras.component.css']
})
export class ListCarteirasComponent implements OnInit {
  nomeCarteira: string = '';
  carteiras: any[] = [];
  carteiraSelecionada: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.carregarCarteiras();
  }

  async carregarCarteiras(): Promise<void> {
    try {
      const email = sessionStorage.getItem('email') as string;
      if(email){}
        const response = await firstValueFrom(this.authService.getCarteiras(email));
      this.carteiras = response.result; // Extrai o array de carteiras
      console.log('Carteiras carregadas:', this.carteiras);
    } catch (erro) {
      console.error('Erro ao carregar carteiras:', erro);
    }
  }
  
  
  

  criarCarteira(): void {
    this.router.navigate(['/criar-carteira']);
  }

  selecionarCarteira(carteira: any): void {
    this.carteiraSelecionada = carteira;
  }
}




