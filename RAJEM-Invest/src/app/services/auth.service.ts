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
    return this.http.post('/login', { username, password });
  }

  createToken(email: string): Observable<any> {
    debugger;
    return this.http.post('/createToken', { email });
  }

  // Método para enviar o email e receber o token - TESTE
  gerarToken(email: string): Observable<string> {
  debugger;
    //Método para enviar o email e receber o token
    // fetch('http://localhost:3000/createToken', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     email: 'alex@teste.com'
    //   })
    // })
    //   .then(response => response.json())
    //   .then(data => console.log('Success:', data))
    //   .catch(error => console.error('Error:', error));


    return this.http.post<string>(`http://localhost:3000/createToken`, { email });
  }

  validarToken(email: string, token: string): Observable<boolean> {
    // Método para enviar o email e receber o token - TESTE
    return of(true);

    //Método para enviar o email e receber o token 
    return this.http.post<boolean>(`${this.apiUrl}/validar-token`, { email, token });
  }
}

