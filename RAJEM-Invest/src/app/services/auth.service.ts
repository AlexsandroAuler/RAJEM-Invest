// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// Definição da interface para a resposta do token
export interface TokenResponse {
  token: string; // A propriedade que contém o token gerado
}

@Injectable({
  providedIn: 'root' // Isso garante que o serviço esteja disponível em toda a aplicação
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:3000'; // Defina o URL da API

  constructor(private http: HttpClient) {}

  // Método para enviarDadosPrimeiroLogin
  enviarDadosPrimeiroLogin(dados: { emailRecuperacao: string; senha: string; confirmarSenha: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/dados-primeiro-login`, dados);
  }

  // Método para realizar o login
  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, senha });
  }

  // Método para criar um token a partir do email
  gerarToken(email: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/createToken`, { email });
  }

  // Método para validar um token
  validarToken(email: string, token: string): Observable<boolean> {
     return this.http.post<boolean>(`${this.apiUrl}/validar-token`, { email, token });
  }

  // Novo método para buscar as carteiras
  getCarteiras(email: string): Observable<{ result: any[] }> {
    return this.http.get<{ result: any[] }>(`${this.apiUrl}/listar-carteiras`, {
      params: { email }, // Passa o email como query string
    });
  }

  // Novo método para buscar as iformações de uma carteira específica
  getCarteira(email: string, carteiraId: string): Observable<{ result: any }> {
    return this.http.get<{ result: any[] }>(`${this.apiUrl}/get-carteira`, {
      params: { email, carteiraId },
    });
  }

  // Novo método para Adicionar as carteiras
  criarCarteira(email: string, nomeCarteira: string, acoes: Array<object>): Observable<{ success: boolean; error?: string }> {
    return this.http.post<{ success: boolean; error?: string }>(`${this.apiUrl}/criar-carteira`, {
      email,
      nomeCarteira,
      acoes
    });
  }

  adicionarSaldoCarteira(email: string, carteiraId: string, saldo: number): Observable<{ success: boolean; error?: string, novoSaldo?: number,  valorNaoInvestido?: number}> {
    return this.http.post<{ success: boolean; error?: string }>(`${this.apiUrl}/adicionar-saldo-carteira`, {
      email,
      carteiraId,
      saldo
    });
  }

  calcularQuantidades(valorInicial: number, acoes: Array<object>){
    return this.http.post<{ success: boolean; error?: string }>(`${this.apiUrl}/validar-quantidade-acoes`, {
      investimentoInicial: valorInicial,
      acoes: acoes
    });
  }

  rebalancoCarteira(valorNaoInvestido: number, acoes: Array<object>): Observable<{ success: boolean; error?: string, result: Array<object>, saldoInsuficiente?: boolean }>{
    return this.http.post<{ success: boolean; error?: string; result: Array<object>}>(`${this.apiUrl}/rebalancear-carteira-acoes`, {
      valorNaoInvestido,
      acoes
    });
  }

  consultarCotacoes(acoes: Array<object>){
    return this.http.post<{ success: boolean; error?: string, result: Array<any>}>(`${this.apiUrl}/consultar-cotacoes`, {
      acoes: acoes
    });
  }

  consultarIdsAcoes(): Observable<{ result: Array<string> }> {
    return this.http.get<{ result: any[] }>(`${this.apiUrl}/get-all-actions-names`, {});
  }

  salvarCarteira(email: string, carteiraInfo : any): Observable<{ success: boolean; error?: string, result?: any }>{
    return this.http.post<{ success: boolean; error?: string }>(`${this.apiUrl}/salvar-carteira`, {
      email,
      carteiraInfo
    });
  }

  removerAcoesCarteira(email: string, carteiraId : string, acaoID: string, quantidadeAcao: number): Observable<{ success: boolean; error?: string, result?: any }>{
    return this.http.post<{ success: boolean; error?: string }>(`${this.apiUrl}/remover-acao-carteira`, {
      email,
      carteiraId,
      acaoID,
      quantidadeAcao
    });
  }

}

