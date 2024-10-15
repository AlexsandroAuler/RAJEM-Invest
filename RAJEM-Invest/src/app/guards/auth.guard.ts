import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = sessionStorage.getItem('token'); // Verifica o token
  const email = sessionStorage.getItem('email'); // Verifica o email armazenado
  

  const router = inject(Router); // Injeta o Router para redirecionar

  // Verifica se o token e o email são válidos
  if (token && email) {
    return true; // Permite o acesso
  } else {
    alert('Acesso negado. O email fornecido não tem permissão para acessar esta rota.');
    router.navigate(['']); // Redireciona para login se o acesso for negado
    return false; // Bloqueia o acesso
  }
};

