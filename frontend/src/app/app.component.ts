import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary" class="flex justify-between">
      <div>
        <a routerLink="/" class="text-white no-underline">
          <span class="text-xl">VibeCoding Platform</span>
        </a>
      </div>

      <div class="flex items-center space-x-4">
        @if (isAuthenticated()) {
          <a mat-button routerLink="/problems">Problems</a>
          <a mat-button routerLink="/submissions">Submissions</a>
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
            {{ getUserName() }}
          </button>
          <mat-menu #userMenu="matMenu">
            <a mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </a>
            <button mat-menu-item (click)="onLogout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        } @else {
          <a mat-button routerLink="/login">Login</a>
          <a mat-button routerLink="/register">Register</a>
        }
      </div>
    </mat-toolbar>

    <div class="container mx-auto p-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Subscribe to auth status changes if needed
    this.authService.getAuthStatus().subscribe(
      isAuthenticated => {
        // Handle authentication status changes if needed
        console.log('Auth status changed:', isAuthenticated);
      }
    );
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getUserName(): string {
    const userInfo = this.authService.getUserInfo();
    return userInfo?.username || 'User';
  }

  onLogout(): void {
    console.log('Logging out...');
    this.authService.logout();
  }
}
