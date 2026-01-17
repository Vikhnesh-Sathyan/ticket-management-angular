import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tickets',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'tickets',
    loadComponent: () => import('./components/ticket-list/ticket-list.component').then(m => m.TicketListComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/tickets'
  }
];
