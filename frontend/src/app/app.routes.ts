import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'selection',
    loadComponent: () => import('./components/selection/selection.component').then(m => m.SelectionComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'problems',
    loadComponent: () => import('./components/problem/problem-list/problem-list.component').then(m => m.ProblemListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'problems/:id',
    loadComponent: () => import('./components/problem/problem-detail/problem-detail.component').then(m => m.ProblemDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'submissions',
    loadComponent: () => import('./components/submission/submission-list/submission-list.component').then(m => m.SubmissionListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  }
];
