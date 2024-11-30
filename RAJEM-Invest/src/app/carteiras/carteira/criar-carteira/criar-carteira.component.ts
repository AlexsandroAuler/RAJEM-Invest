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
  podeCriarCarteira: boolean = false;

  linhas: { idAcao: string; setorAcao: string; percentual: number; cotacaoAtual: number; quantidade: number }[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.username = sessionStorage.getItem('email') || '';
  }

  //#region Criar Carteira
  async criarCarteira(): Promise<void> {
    try {
      if(!this.podeCriarCarteira)
        return alert("Você deve calcular as quantidades antes de poder criar a sua carteira.");

      const email = sessionStorage.getItem('email') as string;
      const nomeCarteira = (document.getElementById("nomeCarteira") as HTMLInputElement).value;

      let acoes = new Array<any>();
      //montar tabela de ações
      this.linhas.forEach(linha => {
        if (linha.percentual > 0) {
          const acao = {"idAcao": linha.idAcao, "setorAcao": linha.setorAcao, "quantidade": linha.quantidade, "cotacaoMomentoCompra": Number(linha.cotacaoAtual), "percentualOriginal": linha.percentual};
          acoes.push(acao);
        }
      });
      
      if (email && nomeCarteira && acoes) {
        // Faz a requisição para adicionar uma nova carteira
        const response = await firstValueFrom(this.authService.criarCarteira(email, nomeCarteira, acoes));
        
        if (response) { // Supondo que o backend retorna um campo `success` na resposta
          alert('Carteira Adicionada com sucesso!')
          sessionStorage.setItem('email', this.username);
          this.router.navigate(['/listar-carteira']);
          // Opcionalmente, você pode limpar o campo de entrada após a adição
          (document.getElementById("nomeCarteira") as HTMLInputElement).value = '';
        } else {
          console.error('Erro ao adicionar carteira:');
        }
      } else {
        console.error('Nome da carteira ou ações não fornecidas');
      }
    } catch (erro) {
      console.error('Erro ao adicionar carteira:', erro);
    }
  }
  //#endregion

  //#region Manipular Tabela

  adicionarLinha(): void {
    this.linhas.push({ idAcao: '', setorAcao: '', percentual: 0, cotacaoAtual: 0, quantidade: 0 });
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
  
  async consultarCotacoes(): Promise<void> {
    this.podeCriarCarteira = false;

    if(!this.calcularSomatoriaPercentuais())
      alert('A somatória dos percentuais deve ser igual a 100%');
    else{
      let acoes = new Array<any>();

      this.linhas.forEach(linha => {
        if (linha.percentual > 0) {
          const acao = {"idAcao": linha.idAcao, "setorAcao": linha.setorAcao, "percentual": linha.percentual};
          acoes.push(acao);
        }
      });

      if(await this.validarIdsAcoesTabela(acoes)){
        return alert('Um ou mais IDs de ações foram informados incorretamente.');
      }

      const response = await firstValueFrom(this.authService.consultarCotacoes(acoes));
      this.ajustarCotacaoTabela(response);
    }
  }
  
  ajustarCotacaoTabela(result: any): void{
    this.linhas.forEach(linha => {
      var acaoRetorno = result.result.find((x: any) => x.idAcao === linha.idAcao);
      linha.setorAcao = acaoRetorno.setorAcao;
      linha.cotacaoAtual = acaoRetorno.cotacaoAtual;
    });

    this.podeCriarCarteira = true;
  }
  //#endregion

  async validarIdsAcoesTabela(acoes: Array<any>): Promise<boolean>{
    const nomesAcoes = await firstValueFrom(this.authService.consultarIdsAcoes());
    let acaoIncorreta = false;
    acoes.forEach(acao => {
      if(!nomesAcoes.result.includes(acao.idAcao)){
        acaoIncorreta = true;
      }
    });

    return acaoIncorreta;
  }

  voltarCarteira(): void{
    this.router.navigate(['/listar-carteira']);
  }
}
