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
  totalPercentual: number = 0;

  linhas: { acaoID: string; setorAcao: string; percentual: number; cotacaoAtual: number; quantidade: number }[] = [];

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

      const email = sessionStorage.getItem('email') as string;
      const nomeCarteira = (document.getElementById("nomeCarteira") as HTMLInputElement).value;

      if(nomeCarteira == ""){
        return alert("Você deve dar um nome a Carteira");
      }

      let acoes = new Array<any>();

      //montar tabela de ações
      this.linhas.forEach(linha => {
        if (linha.percentual > 0) {
          const acao = {"acaoID": linha.acaoID, "setorAcao": linha.setorAcao, "quantidade": linha.quantidade, "cotacaoMomentoCompra": Number(linha.cotacaoAtual), "percentualOriginal": linha.percentual};
          acoes.push(acao);
          this.totalPercentual += linha.percentual;

          if (this.totalPercentual == 100) {
            this.podeCriarCarteira = true;
          }
        }else{
        return alert("Você deve inserir um percentual em todas as ações listada");
        }
      });
      
      if (email && nomeCarteira && acoes && acoes.length > 0) {
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
    this.linhas.push({ acaoID: '', setorAcao: '', percentual: 0, cotacaoAtual: 0, quantidade: 0 });
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
      let acoes = new Array<any>();

      this.linhas.forEach(linha => {
        
      const acao = {"acaoID": linha.acaoID, "setorAcao": linha.setorAcao, "percentual": linha.percentual};
      acoes.push(acao);
       
      });

      if(await this.validarIdsAcoesTabela(acoes)){
        return alert('Um ou mais IDs de ações foram informados incorretamente.');
      }
      const response = await firstValueFrom(this.authService.consultarCotacoes(acoes));
      this.ajustarCotacaoTabela(response);
  }
 
  
  ajustarCotacaoTabela(result: any): void{
    this.linhas.forEach(linha => {
      var acaoRetorno = result.result.find((x: any) => x.acaoID === linha.acaoID);
      linha.setorAcao = acaoRetorno.setorAcao;
      linha.cotacaoAtual = acaoRetorno.cotacaoAtual;
    });  
  }
  //#endregion

  async validarIdsAcoesTabela(acoes: Array<any>): Promise<boolean>{
    const nomesAcoes = await firstValueFrom(this.authService.consultarIdsAcoes());
    let acaoIncorreta = false;
    acoes.forEach(acao => {
      if(!nomesAcoes.result.includes(acao.acaoID)){
        acaoIncorreta = true;
      }
    });

    return acaoIncorreta;
  }

  voltarCarteira(): void{
    this.router.navigate(['/listar-carteira']);
  }
}
