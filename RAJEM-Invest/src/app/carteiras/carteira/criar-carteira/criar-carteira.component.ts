import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom} from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-criar-carteira',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './criar-carteira.component.html',
  styleUrl: './criar-carteira.component.css'
})
export class CriarCarteiraComponent {
  nomeCarteira: string = '';
  username : string = '';
  password: string = '';
  valorInvestimento: number = 0;

  linhas: { idAcao: string; percentual: number; cotacaoAtual: number; quantidade: number }[] = [];

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

  adicionarLinha(): void {
    this.linhas.push({ idAcao: '', percentual: 0, cotacaoAtual: 0, quantidade: 0 });
  }

  removerLinha(index: number): void {
    this.linhas.splice(index, 1);
  }

  calcularSomatoriaPercentuais(): boolean{
    let percentual = 0;
    this.linhas.forEach(linha => {percentual += linha.percentual});

    if(percentual === 100)
      return true;
    else
    return false;
  }
  
  async calcularTabela(): Promise<void> {
    if(!this.calcularSomatoriaPercentuais())
      alert('A somatória dos percentuais deve ser igual a 100%')
    if(this.valorInvestimento <= 0)
      alert('O valor do investimento deve ser maior que 0 (zero)')
    else{
      let acoes = new Array<any>();

      this.linhas.forEach(linha => {
        if (linha.percentual > 0) {
          const acao = {"idAcao": linha.idAcao, "percentual": linha.percentual};
          acoes.push(acao);
        }
      });

      const response = await firstValueFrom(this.authService.calcularQuantidades(this.valorInvestimento, acoes));
      debugger;
      this.ajustarTabela(response);
    }
  }
  ajustarTabela(result: any): void{
    this.linhas.forEach(linha => {
      debugger;
      var acaoRetorno = result.result.find((x: any) => x.idAcao === linha.idAcao);
      linha.quantidade = acaoRetorno.quantidade;
      linha.cotacaoAtual = acaoRetorno.cotacaoAtual;
    });
  }

}
