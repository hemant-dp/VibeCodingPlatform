import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  if (authService.isAuthenticated()) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authService.getAuthorizationHeader())
    });
    return next(authReq);
  }
  
  return next(req);
}; 