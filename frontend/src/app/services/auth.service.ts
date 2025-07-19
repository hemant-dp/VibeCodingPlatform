import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'user_info';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap((response: any) => {
          this.setToken(response.token);
          this.setUserInfo({
            username: response.username,
            role: response.role
          });
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { username, email, password });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUserInfo(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUserInfo(): any {
    const userInfo = localStorage.getItem(this.userKey);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
} 