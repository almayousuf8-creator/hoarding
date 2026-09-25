import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent) },
  { path: 'public', loadComponent: () => import('./components/hoarding-list/hoarding-list.component').then(c => c.HoardingListComponent) },
  { path: 'admin', loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent) },
  { path: 'client', loadComponent: () => import('./components/client-dashboard/client-dashboard.component').then(c => c.ClientDashboardComponent) },
  { path: 'hoardings/:id', loadComponent: () => import('./components/hoarding-detail/hoarding-detail.component').then(c => c.HoardingDetailComponent) },
  { path: '**', redirectTo: '' }
];
