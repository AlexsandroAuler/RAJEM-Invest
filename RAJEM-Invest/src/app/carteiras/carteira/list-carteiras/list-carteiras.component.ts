import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-list-carteiras',
  standalone: true,
  imports: [],
  templateUrl: './list-carteiras.component.html',
  styleUrl: './list-carteiras.component.css'
})
export class ListCarteirasComponent {
  nomeCarteira : string = '';

  constructor(private authService: AuthService, private router: Router){}

  criarCarteira(){
      this.router.navigate(['/criar-carteira']);
  }
}
