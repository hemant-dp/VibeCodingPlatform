import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent),
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about-us/about-us.component').then(m => m.AboutUsComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'solutions',
    loadComponent: () => import('./components/solutions/solutions.component').then(m => m.SolutionsComponent)
  },
  {
    path: 'resources',
    loadComponent: () => import('./components/resources/resources.component').then(m => m.ResourcesComponent)
  },
  {
    path: 'developers',
    loadComponent: () => import('./components/developers/developers.component').then(m => m.DevelopersComponent)
  },
  {
    path: 'our-vision',
    loadComponent: () => import('./components/our-vision/our-vision.component').then(m => m.OurVisionComponent)
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
    path: 'submissions/:id',
    loadComponent: () => import('./components/submission/submission-detail/submission-detail.component').then(m => m.SubmissionDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  }
];
