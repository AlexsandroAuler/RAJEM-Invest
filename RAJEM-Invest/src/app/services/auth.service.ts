import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root' // Isso garante que o serviço esteja disponível em toda a aplicação
})
export class AuthService {
  apiUrl: any;
  email : any;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/login', { username, password });
  }

  // Método para enviar o email e receber o token - TESTE
  gerarToken(email: string): Observable<string> {
    return of('rodrigo10');
  
    //Método para enviar o email e receber o token 
    //return this.http.post<string>(`${this.apiUrl}/gerar-token`, { email });
  }

  validarToken(email: string, token: string): Observable<boolean> {
    // Método para enviar o email e receber o token - TESTE
    return of(true);

    //Método para enviar o email e receber o token 
    return this.http.post<boolean>(`${this.apiUrl}/validar-token`, { email, token });
  }
}

