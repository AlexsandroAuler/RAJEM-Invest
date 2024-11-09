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
  
}

