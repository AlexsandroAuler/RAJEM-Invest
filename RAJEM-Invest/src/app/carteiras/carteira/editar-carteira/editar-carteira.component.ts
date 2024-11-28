import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom} from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-editar-carteira',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-carteira.component.html',
  styleUrl: './editar-carteira.component.css'
})
export class EditarCarteiraComponent {
  username : string = '';
  valorInvestimento: number = 0;
  linhas: { idAcao: string; setorAcao: string; objetivo: number;
    cotacaoAtual: number; quantidade: number, patrimonioAtualizado: number, 
    participacaoAtual: number, distanciaDoObjetivo: number}[] = [];
    podeCriarCarteira: boolean = false;

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
      this.carteiraInfo.acoesCarteira.forEach(acao => {
        const patrimonioAcao = acao.cotacaoMomentoCompra * acao.quantidadeAcao;
        const distanciaObjetivo = acao.percentualDefinidoParaCarteira - 0;

        this.adicionarLinhaAcao(acao.acaoID, acao.setorAcao, 0, acao.quantidadeAcao, patrimonioAcao, 0, acao.percentualDefinidoParaCarteira, 0);
      });

    } catch (erro) {
      console.error('Erro ao carregar carteiras:', erro);
    }
  }

  async calcularQuantidade(): Promise<void>{

  }

  async adicionarAcao(): Promise<void>{
    this.valorInvestimento = Number((document.getElementById("valorInvestimento") as HTMLInputElement).value);
  }

  adicionarLinha(): void {
    this.linhas.push({ idAcao: '', setorAcao: '', objetivo: 0, cotacaoAtual: 0, quantidade: 0, patrimonioAtualizado: 0, participacaoAtual: 0, distanciaDoObjetivo: 0 });
  }

  adicionarLinhaAcao(idAcao: string, setorAcao: string, 
    cotacaoAtual: number, quantidade: number, patrimonioAtualizado: number, 
    participacaoAtual: number, objetivo: number, distanciaDoObjetivo: number)
    : void{
      this.linhas.push({ idAcao, setorAcao, quantidade, cotacaoAtual, patrimonioAtualizado, participacaoAtual, objetivo,distanciaDoObjetivo });
  }

  removerLinha(index: number): void {
    this.linhas.splice(index, 1);
  }

  calcularSomatoriaPercentuais(): boolean{
    let percentual = 0;
    this.linhas.forEach(linha => {percentual += linha.objetivo});

    if(percentual === 100)
      return true;
    else
    return false;
  }

  async calcularTabela(): Promise<void> {
    this.podeCriarCarteira = false;

    if(!this.calcularSomatoriaPercentuais())
      alert('A somatória dos percentuais deve ser igual a 100%');
    else{
      let acoes = new Array<any>();

      this.linhas.forEach(linha => {
        if (linha.objetivo > 0) {
          const acao = {"idAcao": linha.idAcao, "percentual": linha.objetivo};
          acoes.push(acao);
        }
      });

      if(await this.validarIdsAcoesTabela(acoes)){
        return alert('Um ou mais IDs de ações foram informados incorretamente.');
      }

      const response = await firstValueFrom(this.authService.consultarCotacoes(acoes));
      this.ajustarTabela(response);
    }
  }

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

  ajustarTabela(result: any): void{
    this.linhas.forEach(linha => {
      var acaoRetorno = result.result.find((x: any) => x.idAcao === linha.idAcao);
      linha.cotacaoAtual = acaoRetorno.cotacaoAtual;
    });

    this.podeCriarCarteira = true;
  }

  voltarCarteira(): void{
    this.router.navigate(['/listar-carteira']);
  }
}
