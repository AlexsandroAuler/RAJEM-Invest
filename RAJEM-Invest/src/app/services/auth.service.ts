import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Isso garante que o serviço esteja disponível em toda a aplicação
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post('/login', { username, password });
  }

  createToken(email: string): Observable<any> {
    debugger;
    return this.http.post('/createToken', { email });
  }
}

