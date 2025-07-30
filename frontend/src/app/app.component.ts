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
                  <img src="assets/cognizant-logo.png" alt="Cognizant Logo" class="hex-logo-only" style="background:transparent;display:block;object-fit:contain;">
                </div>

                <!-- Primary Navigation -->
                <nav class="main-nav">
  <a routerLink="/" class="nav-link" [class.active]="router.url === '/'">
    <mat-icon class="nav-icon">home</mat-icon> Home
  </a>
  <a routerLink="/problems" class="nav-link" [class.active]="router.url.includes('/problems')">
    <mat-icon class="nav-icon">rocket_launch</mat-icon> Problems
  </a>
  <a routerLink="/developers" class="nav-link" [class.active]="router.url.includes('/developers')">
    <mat-icon class="nav-icon">code</mat-icon> Developers
  </a>
  <a routerLink="/dashboard" class="nav-link" [class.active]="router.url.includes('/dashboard')">
    <mat-icon class="nav-icon">leaderboard</mat-icon> Dashboard
  </a>
  <a routerLink="/our-vision" class="nav-link" [class.active]="router.url.includes('/our-vision')">
    <mat-icon class="nav-icon">groups</mat-icon> Our Vision
  </a>
  <div class="nav-link help-link" [matMenuTriggerFor]="helpMenu">
    <mat-icon class="nav-icon">help_outline</mat-icon> Help
    <mat-icon class="dropdown-arrow">arrow_drop_down</mat-icon>
  </div>
  <mat-menu #helpMenu="matMenu" class="help-menu">
    <button mat-menu-item routerLink="/about"><mat-icon>info</mat-icon> About</button>
    <button mat-menu-item routerLink="/support"><mat-icon>support_agent</mat-icon> Support</button>
    <button mat-menu-item routerLink="/faq"><mat-icon>help</mat-icon> FAQ</button>
    <button mat-menu-item routerLink="/contact"><mat-icon>mail</mat-icon> Contact Us</button>
  </mat-menu>
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
      background-color: rgba(0, 13, 161, 0.5);
    }

    .hex-logo-only {
  height: 80px;
  width: auto;
  max-width: 220px;
  display: block;
  transition: filter 0.3s;
  object-fit: contain;
  vertical-align: middle;
}

.logo-link:hover .hex-logo-only {
  filter: brightness(1.15) drop-shadow(0 0 8pxrgba(0, 51, 161, 0.45));
}


    .main-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 32px;
}

.nav-link {
  position: relative;
  padding: 8px 18px;
  color: #222b45;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.18s cubic-bezier(.4,0,.2,1);
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  cursor: pointer;
}

.nav-link .nav-icon {
  font-size: 19px;
  margin-right: 2px;
  color: inherit;
}

.nav-link:hover,
.nav-link.active {
  color: #fff;
  background: #16213E;
  border-radius: 999px;
  box-shadow: 0 4px 18px 0 #16213e44, 0 0 0 2px #16213ecc;
  text-shadow: 0 0 8px #16213ecc;
}

.help-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.dropdown-arrow {
  font-size: 20px;
  margin-left: 2px;
}

:host ::ng-deep .help-menu {
  min-width: 220px;
  border-radius: 14px !important;
  box-shadow: 0 6px 32px 0 #0033a133,0 0 0 1px #0033a120;
  background: #fff;
  padding: 6px 0;
}

:host ::ng-deep .help-menu .mat-menu-item {
  font-size: 15px;
  color: #0033A1;
  border-radius: 8px;
  transition: background 0.16s;
}

:host ::ng-deep .help-menu .mat-menu-item:hover {
  background: linear-gradient(90deg, #0033A1 0%, #0056D2 100%);
  color: #fff;
}

:host ::ng-deep .help-menu .mat-icon {
  margin-right: 16px;
  font-size: 20px;
  color: inherit;
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
