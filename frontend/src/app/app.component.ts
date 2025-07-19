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
    <div class="min-h-screen flex flex-col">
      <!-- Navbar -->
      <mat-toolbar class="bg-white border-b border-gray-200 px-4">
        <div class="container mx-auto flex items-center justify-between h-16">
          <!-- Left side: Logo and primary navigation -->
          <div class="flex items-center space-x-8">
            <!-- Logo -->
            <a routerLink="/" class="flex items-center">
              <img src="assets/cognizant-logo.png" alt="Cognizant Logo" class="h-8 w-auto">
            </a>

            <!-- Primary Navigation -->
            <nav class="hidden md:flex items-center space-x-1">
              <a routerLink="/" 
                 class="px-4 py-2 rounded-full text-white bg-[#0033A1] hover:bg-[#0033A1]/90 flex items-center">
                <mat-icon class="mr-2">home</mat-icon>
                Home
              </a>
              <a routerLink="/getting-started" 
                 class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 flex items-center">
                <mat-icon class="mr-2">rocket_launch</mat-icon>
                Getting Started
              </a>
              <a routerLink="/resources" 
                 class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 flex items-center">
                <mat-icon class="mr-2">school</mat-icon>
                Resources
              </a>
              <a routerLink="/dashboard" 
                 class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 flex items-center">
                <mat-icon class="mr-2">dashboard</mat-icon>
                Dashboard
              </a>
              <a routerLink="/community" 
                 class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 flex items-center">
                <mat-icon class="mr-2">people</mat-icon>
                Community
              </a>
            </nav>
          </div>

          <!-- Right side: Help and User menu -->
          <div class="flex items-center space-x-4">
            <!-- Help Menu -->
            <button mat-button [matMenuTriggerFor]="helpMenu" 
                    class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 flex items-center">
              <mat-icon class="mr-2">help</mat-icon>
              Help
              <mat-icon class="ml-1">arrow_drop_down</mat-icon>
            </button>
            <mat-menu #helpMenu="matMenu">
              <a mat-menu-item href="#">
                <mat-icon>help_outline</mat-icon>
                <span>Documentation</span>
              </a>
              <a mat-menu-item href="#">
                <mat-icon>contact_support</mat-icon>
                <span>Support</span>
              </a>
            </mat-menu>

            <!-- User Menu -->
            @if (isAuthenticated()) {
              <button mat-button [matMenuTriggerFor]="userMenu" 
                      class="px-2 py-1 rounded-full bg-[#0033A1] text-white hover:bg-[#0033A1]/90 flex items-center">
                <span class="w-8 h-8 rounded-full bg-white text-[#0033A1] flex items-center justify-center font-bold mr-2">
                  {{ getUserInitial() }}
                </span>
                {{ getUserName() }}
                <mat-icon class="ml-1">arrow_drop_down</mat-icon>
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
              <a mat-button routerLink="/login" 
                 class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100">
                Login
              </a>
              <a mat-button routerLink="/register" 
                 class="px-4 py-2 rounded-full bg-[#0033A1] text-white hover:bg-[#0033A1]/90">
                Register
              </a>
            }
          </div>
        </div>
      </mat-toolbar>

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
      height: auto;
      padding: 0.5rem 0;
    }
    .mat-mdc-button {
      height: 40px;
      border-radius: 20px;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getAuthStatus().subscribe(
      isAuthenticated => {
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

  getUserInitial(): string {
    const name = this.getUserName();
    return name.charAt(0).toUpperCase();
  }

  onLogout(): void {
    console.log('Logging out...');
    this.authService.logout();
  }
}
