import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom} from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-ativos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-ativos.component.html',
  styleUrls: ['./list-ativos.component.css']
})
export class ListAtivosComponent implements OnInit {
  username: string = '';
  acoes: any[] = [];
  baseUrlEdit: string = "http://localhost:4200/editar-carteira/";
  sortColumn: string = '';
  sortDirection: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.username = sessionStorage.getItem('email') || '';
    await this.carregarAtivos();
  }

  async carregarAtivos(): Promise<void> {
    try {
      const email = sessionStorage.getItem('email') as string;
      if(email){}
        const response = await firstValueFrom(this.authService.consultarTodasAcoes());
      this.acoes = response.result;
    } catch (erro) {
      console.error('Erro ao carregar carteiras:', erro);
    }
  }

  ordenar(coluna: string): void {
    if (this.sortColumn === coluna) {
      this.sortDirection = !this.sortDirection; // Alterna entre crescente e decrescente
    } else {
      this.sortColumn = coluna;
      this.sortDirection = true;
    }

    this.acoes.sort((a, b) => {
      const valorA = coluna === 'close' ? +a[coluna] : a[coluna].toLowerCase();
      const valorB = coluna === 'close' ? +b[coluna] : b[coluna].toLowerCase();

      if (valorA < valorB) return this.sortDirection ? -1 : 1;
      if (valorA > valorB) return this.sortDirection ? 1 : -1;
      return 0;
    });
  }

  listagemAtivos(): void{
    this.router.navigate(['/listar-ativos']);
  }

  listagemCarteiras(): void{
    this.router.navigate(['/listar-carteira']);
  }
}