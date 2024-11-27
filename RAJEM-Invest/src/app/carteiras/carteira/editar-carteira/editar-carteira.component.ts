import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom} from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-carteira',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editar-carteira.component.html',
  styleUrl: './editar-carteira.component.css'
})
export class EditarCarteiraComponent {
  username : string = '';

  carteiraInfo: { carteira: any; acoesCarteira: Array<any> } = {
    carteira: null,
    acoesCarteira: []
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    const idCarteira = this.route.snapshot.paramMap.get('id'); // Recupera o ID da URL
    this.username = sessionStorage.getItem('email') || '';
    
    if (idCarteira) {
      await this.carregarDadosCarteira(idCarteira);
    }
    
    
  }

  async carregarDadosCarteira(carteiraId: string): Promise<void> {
    try {
      if(this.username){}
        const response = await firstValueFrom(this.authService.getCarteira(this.username, carteiraId));
      this.carteiraInfo = response.result;

    } catch (erro) {
      console.error('Erro ao carregar carteiras:', erro);
    }
  }
}
