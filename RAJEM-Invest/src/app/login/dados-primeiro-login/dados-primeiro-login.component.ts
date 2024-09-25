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

}
