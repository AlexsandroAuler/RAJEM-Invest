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
  private apiUrl = 'http://localhost:3000'; // Defina o URL da API

  constructor(private http: HttpClient) {}

  // Método para realizar o login
  login(username: string, password: string): Observable<any> {
    return this.http.post('/login', { username, password });
  }

  // Método para criar um token a partir do email
  gerarToken(email: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/createToken`, { email });
  }

  // Método para validar um token
  validarToken(email: string, token: string): Observable<boolean> {
    // Aqui você deve implementar a lógica para validar o token
    // Por enquanto, vamos simular que a validação sempre retorna verdadeiro
    return of(true);
    
    // Se você tiver uma API para validar o token, use a linha abaixo
    // return this.http.post<boolean>(`${this.apiUrl}/validar-token`, { email, token });
  }
}
