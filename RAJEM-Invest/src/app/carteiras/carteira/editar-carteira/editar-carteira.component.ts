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
  primeiraCompra: boolean = true;
  mensagemErro = '';
  cotacoesAtualizadas = new Array<any>;
  valorTotalCarteiraCotacaoAtual: number = 0;
  
  linhas: { acaoID: string; setorAcao: string; objetivo: number;
    cotacaoAtual: number; quantidade: number, patrimonioAtualizado: number, 
    participacaoAtual: number, distanciaDoObjetivo: number}[] = [];

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
      this.ajustarCotacaoTabela(this.cotacoesAtualizadas);
    }
    
  }

  async carregarDadosCarteira(carteiraId: string): Promise<void> {
    try {
      if(this.username){}
        const response = await firstValueFrom(this.authService.getCarteira(this.username, carteiraId));

      this.carteiraInfo = response.result;
      this.primeiraCompra = this.carteiraInfo.carteira.primeiraCompra;

      this.cotacoesAtualizadas = (await firstValueFrom(this.authService.consultarCotacoes(this.carteiraInfo.acoesCarteira))).result;
      const valorTotalCarteira = this.calcularValorTotal(this.carteiraInfo.acoesCarteira, this.cotacoesAtualizadas);

      this.carteiraInfo.acoesCarteira.forEach(acao => {
        const valorAtualizadoCotacao = this.cotacoesAtualizadas.find((x: any) => x.acaoID === acao.acaoID).cotacaoAtual;
        const patrimonioAcao = this.formatarValor(valorAtualizadoCotacao * acao.quantidadeAcao)
        const participacaoAtual = this.formatarValor((patrimonioAcao * 100) / valorTotalCarteira);
        const distanciaObjetivo = this.formatarValor(participacaoAtual - acao.percentualDefinidoParaCarteira);

        this.valorTotalCarteiraCotacaoAtual += patrimonioAcao;//valor atualizado pela cotação de agora

        this.adicionarLinhaAcao(acao.acaoID, acao.setorAcao, 0, acao.quantidadeAcao, patrimonioAcao, participacaoAtual, acao.percentualDefinidoParaCarteira, distanciaObjetivo);
      });

      this.valorTotalCarteiraCotacaoAtual = this.formatarValor(this.valorTotalCarteiraCotacaoAtual);

    } catch (erro) {
      console.error('Erro ao carregar carteiras:', erro);
    }
  }

   calcularValorTotal(listaA: Array<any>, listaB: Array<any>): number {
    return listaA.reduce((total, acaoA) => {
      const acaoB = listaB.find(acao => acao.acaoID === acaoA.acaoID);
  
      if (acaoB) {
        total += acaoA.quantidadeAcao * acaoB.cotacaoAtual;
      }
      return this.formatarValor(total);
    }, 0);
  }

  async adicionarSaldoCarteira(): Promise<void>{
    const carteiraId = this.route.snapshot.paramMap.get('id');
    const saldo = this.valorInvestimento;

    if(carteiraId && saldo){
      const response = await firstValueFrom(this.authService.adicionarSaldoCarteira(this.username, carteiraId, Number(saldo)));

      if(response.success){
        this.carteiraInfo.carteira.valorInvestimento = response.novoSaldo;
        this.carteiraInfo.carteira.valorNaoInvestido = response.valorNaoInvestido;
        this.valorInvestimento = 0;
      }
    }
  }

  async adicionarAcao(): Promise<void>{
    this.valorInvestimento = Number((document.getElementById("valorInvestimento") as HTMLInputElement).value);
  }

  adicionarLinha(): void {
    this.linhas.push({ acaoID: '', setorAcao: '', objetivo: 0, cotacaoAtual: 0, quantidade: 0, patrimonioAtualizado: 0, participacaoAtual: 0, distanciaDoObjetivo: 0 });
  }

  adicionarLinhaAcao(acaoID: string, setorAcao: string, 
    cotacaoAtual: number, quantidade: number, patrimonioAtualizado: number, 
    participacaoAtual: number, objetivo: number, distanciaDoObjetivo: number)
    : void{
      this.linhas.push({ acaoID, setorAcao, quantidade, cotacaoAtual, patrimonioAtualizado, participacaoAtual, objetivo,distanciaDoObjetivo });
  }

  removerLinha(index: number): void {
    this.linhas.splice(index, 1);
  }

  async calcularTabela(): Promise<void> {
    if(await this.validar()){
      this.alertar();
    }

    else{
      let acoes = new Array<any>();
      this.linhas.forEach(linha => {
        if (linha.objetivo > 0) {
          const acao = {"acaoID": linha.acaoID, "percentual": linha.objetivo};
          acoes.push(acao);
        }
      });

      const response = await firstValueFrom(this.authService.consultarCotacoes(acoes));
      this.ajustarCotacaoTabela(response.result);
    }
  }

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

  ajustarCotacaoTabela(result: any): void{
    this.linhas.forEach(linha => {
      var acaoRetorno = result.find((x: any) => x.acaoID === linha.acaoID);
      linha.cotacaoAtual = acaoRetorno.cotacaoAtual;
    });
  }

  voltarCarteira(): void{
    this.router.navigate(['/listar-carteira']);
  }

  async sugerirCompra(): Promise<void>{
    if(await this.validar()){
      this.alertar();
    }
    else{
      const result = await firstValueFrom(this.authService.calcularQuantidades(this.carteiraInfo.carteira.valorInvestimento, this.carteiraInfo.acoesCarteira));
      if(!result)
        alert('Ocorreu um erro inesperado, por favor tente novamente.');
      else
        this.aplicarSugestaoTabela(result);
    }
  }

  async rebalancoCarteira(): Promise<void>{
    if(await this.validar()){
      this.alertar();
    }
    else{
      let acoesParaRebalancear: any[] = [];

      this.linhas.forEach(linha => {
        var acao = this.carteiraInfo.acoesCarteira.find((x: any) => x.acaoID === linha.acaoID);
        if(linha.distanciaDoObjetivo < 0){
          acao.distanciaDoObjetivo = linha.distanciaDoObjetivo;
          acoesParaRebalancear.push(acao);
        }
      });
      
      const result = await firstValueFrom(this.authService.rebalancoCarteira(this.carteiraInfo.carteira.valorNaoInvestido, acoesParaRebalancear));
      
      if(result.saldoInsuficiente){
        alert('Saldo insuficiente para a compra das ações.')
      }else{
        this.rebalancoTabela(result);
        this.carteiraInfo.carteira.valorInvestimento += this.carteiraInfo.carteira.valorNaoInvestido;
        this.carteiraInfo.carteira.valorNaoInvestido = 0;
      }
    }
  }

  async salvarCarteira(): Promise<void>{
    if (this.username && this.carteiraInfo.carteira && this.carteiraInfo.acoesCarteira) {
      // Faz a requisição para adicionar uma nova carteira

      //Salvar as cotacoes e quantidades antes de enviar pra salvar
      this.ajustarValoresCarteira();
      const response = await firstValueFrom(this.authService.salvarCarteira(this.username, this.carteiraInfo));
      
      if (response) { // Supondo que o backend retorna um campo `success` na resposta
        alert('Carteira salva com sucesso!')
        sessionStorage.setItem('email', this.username);
        this.router.navigate(['/listar-carteira']);
      } else {
        console.error('Erro ao adicionar carteira:');
      }
    } else {
      console.error('Informações pendentes');
    }
  }

  aplicarSugestaoTabela(result: any): void{
    this.linhas.forEach(linha => {
      var acaoRetorno = result.result.find((x: any) => x.acaoID === linha.acaoID);
      linha.quantidade = acaoRetorno.quantidade;
    });
  }

  rebalancoTabela(result: any): void{
    this.linhas.forEach(linha => {
      var acaoRetorno = result.result.find((x: any) => x.acaoID === linha.acaoID);
      linha.quantidade += acaoRetorno?.quantidade ?? 0;
    });  
  }

  async validar(): Promise<boolean>{
    if(!this.calcularSomatoriaPercentuais()){
      this.mensagemErro = 'A somatória dos percentuais deve ser igual a 100%';
      return true;
    }

    if(await this.validarIdsAcoesTabela(this.carteiraInfo.acoesCarteira)){
       this.mensagemErro = 'Um ou mais IDs de ações foram informados incorretamente.';
       return true;
    }

    return false;
  }

  ajustarValoresCarteira(): void{
    this.linhas.forEach(linha => {
      var acao = this.carteiraInfo.acoesCarteira.find((x: any) => x.acaoID === linha.acaoID);
      acao.quantidadeAcao = linha.quantidade;
      acao.cotacaoMomentoCompra = Number(linha.cotacaoAtual);
      acao.percentualDefinidoParaCarteira = linha.objetivo;
    });
  }

  alertar(){
    alert(this.mensagemErro);
    this.mensagemErro = '';
  }

  calcularSomatoriaPercentuais(): boolean{
    let percentual = 0;
    this.linhas.forEach(linha => {percentual += linha.objetivo});

    if(percentual === 100)
      return true;
    else
    return false;
  }

  formatarValor(valor: any): number{
    if(!valor)
      return Number(valor.toFixed(2));

    return valor;
  }
}
