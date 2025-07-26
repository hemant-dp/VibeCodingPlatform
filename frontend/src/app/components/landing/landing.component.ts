import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatRippleModule
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <!-- Minimal Navbar with Help Icon -->
      <nav class="bg-white fixed w-full top-0 z-50">
        <div class="container mx-auto">
          <div class="flex items-center justify-between h-14 px-6">
            <!-- Left: Enhanced Cognizant Logo -->
            <div class="flex items-center">
              <div class="relative group">
                <!-- Logo with enhanced size -->
                <img src="assets/cognizant-logo.png" 
                     alt="Cognizant" 
                     class="h-10 transform transition-transform duration-300 group-hover:scale-105">
                
                <!-- Subtle glow effect -->
                <div class="absolute -inset-2 bg-gradient-to-r from-cognizant-blue/10 via-cognizant-blue/5 to-transparent 
                            rounded-lg blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              </div>
            </div>

            <!-- Right: Help Icon -->
            <div class="flex items-center">
              <a routerLink="/help" 
                 class="relative group">
                <!-- Icon Circle -->
                <div class="w-8 h-8 rounded-full bg-cognizant-blue bg-opacity-10 flex items-center justify-center
                            transform transition-all duration-300 group-hover:bg-opacity-20">
                  <mat-icon class="text-cognizant-blue icon-sm">help_outline</mat-icon>
                </div>
                <!-- Ripple Effect -->
                <div class="absolute inset-0 rounded-full animate-ping-slow bg-cognizant-blue bg-opacity-20"></div>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Spacer div for navbar -->
      <div class="h-14 mb-8"></div>

      <!-- Main Content -->
      <main class="flex-grow flex items-center justify-center">
        <div class="container mx-auto px-4">
          <div class="flex flex-col items-center text-center">
            <!-- Target/Bullseye Design -->
            <div class="relative w-64 h-64 mx-auto mb-12 group cursor-pointer"
                 matRipple
                 [matRippleCentered]="true"
                 [matRippleUnbounded]="true"
                 [matRippleRadius]="128"
                 routerLink="/selection">
              <!-- Decorative rotating ring -->
              <div class="absolute inset-0 border-4 border-dashed border-cognizant-blue rounded-full animate-spin-slow opacity-20"></div>
              
              <!-- Outer circle with gradient -->
              <div class="absolute inset-0 border-8 border-cognizant-blue rounded-full bg-gradient-to-br from-blue-50 to-white"></div>
              
              <!-- Middle circle with pulse -->
              <div class="absolute inset-8 rounded-full bg-gradient-to-br from-cognizant-blue-light to-cognizant-blue animate-pulse-subtle"></div>
              
              <!-- Inner circle with icon -->
              <div class="absolute inset-16 bg-white rounded-full shadow-inner flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                <mat-icon class="text-cognizant-blue" style="transform: scale(2.5)">track_changes</mat-icon>
              </div>
              
              <!-- Floating elements -->
              <div class="absolute -right-4 -top-4 w-12 h-12 bg-yellow-400 rounded-full animate-float-1 shadow-lg flex items-center justify-center">
                <mat-icon class="text-white">code</mat-icon>
              </div>
              <div class="absolute -left-6 top-1/2 w-10 h-10 bg-green-500 rounded-full animate-float-2 shadow-lg flex items-center justify-center">
                <mat-icon class="text-white">psychology</mat-icon>
              </div>
              <div class="absolute -right-2 -bottom-2 w-14 h-14 bg-purple-500 rounded-full animate-float-3 shadow-lg flex items-center justify-center">
                <mat-icon class="text-white">emoji_events</mat-icon>
              </div>
            </div>

            <!-- Text Content -->
            <h1 class="text-6xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
              Welcome to <span class="text-cognizant-blue">Cognizant</span>
            </h1>
            <p class="text-2xl text-gray-600 mb-12">
              Where Innovation Meets Excellence
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap justify-center gap-4">
              <button mat-raised-button 
                      class="bg-cognizant-blue text-white px-8 py-3 rounded-full text-lg hover:transform hover:scale-105 transition-transform"
                      routerLink="/selection">
                <span class="flex items-center">
                  Start Your Journey
                  <mat-icon class="ml-2">arrow_forward</mat-icon>
                </span>
              </button>
              <button mat-stroked-button 
                      class="border-cognizant-blue text-cognizant-blue px-8 py-3 rounded-full text-lg hover:bg-blue-50"
                      routerLink="/problems">
                <span class="flex items-center">
                  Browse Problems
                  <mat-icon class="ml-2">list</mat-icon>
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Navbar Styles */
    nav {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    .container {
      max-width: 1440px;
      margin: 0 auto;
    }

    /* Help Icon Animation */
    @keyframes ping-slow {
      0% { transform: scale(1); opacity: 0.2; }
      75%, 100% { transform: scale(1.5); opacity: 0; }
    }

    .animate-ping-slow {
      animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    /* Icon size adjustment */
    .icon-sm {
      font-size: 16px;
      height: 16px;
      width: 16px;
      line-height: 16px;
    }

    /* Enhanced Logo Styles */
    .group:hover .blur-lg {
      --tw-blur: blur(20px);
    }

    /* Responsive Adjustments */
    @media (max-width: 768px) {
      .container {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      /* Adjust navbar height on mobile */
      .h-14 {
        height: 3.5rem;
      }

      /* Adjust logo size on mobile */
      .h-10 {
        height: 2.25rem;
      }

      /* Adjust spacing on mobile */
      .mb-8 {
        margin-bottom: 1.5rem;
      }
    }
  `]
})
export class LandingComponent {
  currentYear = new Date().getFullYear();
} 