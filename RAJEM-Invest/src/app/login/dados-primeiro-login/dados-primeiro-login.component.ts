import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dados-primeiro-login',
  standalone: true,
  imports: [],
  templateUrl: './dados-primeiro-login.component.html',
  styleUrl: './dados-primeiro-login.component.css'
})
export class DadosPrimeiroLoginComponent {
  constructor(private router: Router) {}

  gerarToken(){
    debugger;
    fetch('http://localhost:3000/createToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'alex@teste.com'
      })
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
  }
}
