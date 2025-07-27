import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import { User } from './services/auth.service';

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
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      @if (!isLandingPage && !isProblemDetailPage) {
        <div class="sticky top-0 z-50 bg-white transition-shadow duration-300" [class.shadow-md]="isScrolled">
          <mat-toolbar class="px-4">
            <div class="container mx-auto flex items-center justify-between h-16">
              <!-- Left side: Logo and primary navigation -->
              <div class="flex items-center">
                <!-- Logo -->
                <div class="logo-container">
                  <a routerLink="/" class="logo-link">
                    <img src="assets/cognizant-logo.png" alt="Cognizant Logo" class="logo-image">
                  </a>
                </div>

                <!-- Primary Navigation -->
                <nav class="hidden lg:flex items-center space-x-1">
                  <a routerLink="/products" class="nav-link" [class.active]="router.url.includes('/products')">
                    <mat-icon class="nav-icon">apps</mat-icon> Products
                  </a>
                  <a routerLink="/solutions" class="nav-link" [class.active]="router.url.includes('/solutions')">
                    <mat-icon class="nav-icon">lightbulb</mat-icon> Solutions
                  </a>
                  <a routerLink="/resources" class="nav-link" [class.active]="router.url.includes('/resources')">
                    <mat-icon class="nav-icon">menu_book</mat-icon> Resources
                  </a>
                  <a routerLink="/pricing" class="nav-link" [class.active]="router.url.includes('/pricing')">
                    <mat-icon class="nav-icon">attach_money</mat-icon> Pricing
                  </a>
                  <a routerLink="/developers" class="nav-link" [class.active]="router.url.includes('/developers')">
                    <mat-icon class="nav-icon">code</mat-icon> For Developers
                  </a>
                  <a routerLink="/about" class="nav-link" [class.active]="router.url === '/about'">
                    <mat-icon class="nav-icon">info</mat-icon> About Us
                  </a>
                </nav>
              </div>

              <!-- Right side with user menu -->
              <div class="flex items-center space-x-4">
                @if (isAuthenticated()) {
                  <button mat-button [matMenuTriggerFor]="userMenu" 
                          class="user-button">
                    <div class="flex items-center">
                      <div class="user-avatar-circle">
                        {{ getUserInitial() }}
                      </div>
                      <span class="text-[#666666] ml-1 mr-1">{{ currentUser?.username }}</span>
                      <mat-icon class="text-[#666666] transform scale-75">arrow_drop_down</mat-icon>
                    </div>
                  </button>
                  <mat-menu #userMenu="matMenu" class="mt-2">
                    <div class="py-1">
                      <div class="px-4 py-2 border-b border-gray-200">
                        <div class="font-medium text-gray-900">{{ currentUser?.username }}</div>
                      </div>
                      <a mat-menu-item routerLink="/profile" class="menu-item">
                        <mat-icon class="menu-icon">person</mat-icon>
                        <span>Profile</span>
                      </a>
                      <a mat-menu-item routerLink="/dashboard" class="menu-item">
                        <mat-icon class="menu-icon">dashboard</mat-icon>
                        <span>Dashboard</span>
                      </a>
                      <a mat-menu-item routerLink="/settings" class="menu-item">
                        <mat-icon class="menu-icon">settings</mat-icon>
                        <span>Settings</span>
                      </a>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="onLogout()" class="menu-item">
                        <mat-icon class="menu-icon">exit_to_app</mat-icon>
                        <span>Sign out</span>
                      </button>
                    </div>
                  </mat-menu>
                } @else {
                  <!-- Empty else block to maintain authentication check -->
                }
              </div>
            </div>
          </mat-toolbar>
        </div>
      }

      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .mat-toolbar {
      height: 72px;
      padding: 0;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    .logo-container {
      margin-left: 24px;
      margin-right: 48px;
      padding: 8px;
    }

    .logo-link {
      display: flex;
      align-items: center;
      padding: 12px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .logo-link:hover {
      transform: scale(1.1);
      background-color: rgba(0, 51, 161, 0.04);
    }

    .logo-image {
      height: 40px;
      width: auto;
      transition: all 0.3s ease;
    }

    .logo-link:hover .logo-image {
      filter: brightness(1.1);
    }

    .nav-link {
      padding: 10px 20px;
      color: #0033A1;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
      letter-spacing: 0.5px;
      background: linear-gradient(90deg, #e3f0ff 0%, #f8fbff 100%);
      box-shadow: 0 2px 8px rgba(0,51,161,0.03);
    }

    .nav-link:hover {
      color: #fff;
      background: linear-gradient(90deg, #0033A1 0%, #0056D2 100%);
      box-shadow: 0 4px 16px rgba(0,51,161,0.10);
    }

    .nav-link.active {
      color: #fff;
      background: linear-gradient(90deg, #0033A1 0%, #0056D2 100%);
      box-shadow: 0 4px 16px rgba(0,51,161,0.13);
    }

    .nav-icon {
      font-size: 18px;
      margin-right: 4px;
      color: inherit;
      vertical-align: middle;
    }

    .nav-link-auth {
      padding: 8px 16px;
      color: #374151;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all 200ms;
      border-radius: 4px;
    }

    .nav-link-auth:hover {
      color: #0033A1;
      background-color: rgba(0, 51, 161, 0.04);
    }

    .nav-link-auth-primary {
      padding: 8px 16px;
      color: white;
      background-color: #0033A1;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all 200ms;
      border-radius: 4px;
    }

    .nav-link-auth-primary:hover {
      background-color: #002A87;
    }

    .user-button {
      min-width: 0;
      padding: 4px 8px;
      height: 36px;
      background: transparent;
      border: none;
      transition: background-color 200ms;
      border-radius: 4px;
    }

    .user-button:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .user-avatar-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #0747A6;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 500;
    }

    .user-name {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      height: 40px;
      color: #333333;
    }

    .menu-icon {
      margin-right: 12px;
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #666666;
    }

    :host ::ng-deep .mat-mdc-menu-content {
      padding: 8px 0;
    }

    :host ::ng-deep .mat-mdc-menu-item {
      min-height: 40px;
    }

    :host ::ng-deep .mat-mdc-menu-item:hover {
      background-color: #F8F9FA;
    }
  `]
})
export class AppComponent implements OnInit {
  isLandingPage = false;
  isProblemDetailPage = false;
  isScrolled = false;
  currentUser: User | null = null;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }

  constructor(
    private authService: AuthService,
    public router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLandingPage = event.url === '/';
      this.isProblemDetailPage = event.url.includes('/problems/') && !event.url.endsWith('/problems/');
    });
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getUserInitial(): string {
    // If we have a full name, use the first letter of first and last names
    if (this.currentUser?.fullName) {
      const nameParts = this.currentUser.fullName.split(' ').filter(part => part.trim().length > 0);
      if (nameParts.length === 0) return '';
      if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    
    // Fall back to username if no full name
    if (this.currentUser?.username) {
      const username = this.currentUser.username;
      if (username.length === 1) return username.toUpperCase();
      return (username.charAt(0) + username.charAt(username.length - 1)).toUpperCase();
    }
    
    return '';
  }

  onLogout(): void {
    console.log('Logging out...');
    this.authService.logout();
  }
}
