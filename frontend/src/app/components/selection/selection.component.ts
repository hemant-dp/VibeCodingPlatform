import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <!-- Main Content -->
      <div class="container mx-auto px-4 py-12 max-w-7xl">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Cognizant's Professional Development Platform
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your path to excellence in technology and professional growth
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <!-- For Companies -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="relative">
              <div class="absolute top-4 left-4 z-10">
                <span class="bg-black text-white text-sm font-medium px-4 py-1 rounded-full">
                  BUSINESS
                </span>
              </div>
              <div class="h-48 bg-gradient-to-r from-[#0033A0] to-[#0047E0] flex items-center justify-center">
                <mat-icon class="text-white transform scale-[3]">business</mat-icon>
              </div>
            </div>
            <div class="p-8">
              <h2 class="text-3xl font-bold mb-4">
                For <span class="italic">Companies</span>
              </h2>
              <p class="text-gray-600 text-lg mb-8 min-h-[80px]">
                Transform your workforce with our comprehensive platform for hiring, 
                upskilling, and managing technical talent.
              </p>
              <button routerLink="/business/login" 
                      class="w-full bg-black text-white py-4 rounded-xl text-lg font-medium mb-4 
                             hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <span>Access Business Portal</span>
                <mat-icon>arrow_forward</mat-icon>
              </button>
              <div class="text-center text-gray-600">
                New to our platform?
                <div class="mt-3 flex justify-center gap-6">
                  <a routerLink="/contact-sales" 
                     class="text-[#0033A0] hover:text-[#0047E0] font-medium flex items-center gap-1">
                    <mat-icon class="text-sm">phone</mat-icon>
                    Contact Sales
                  </a>
                  <a routerLink="/free-trial" 
                     class="text-[#0033A0] hover:text-[#0047E0] font-medium flex items-center gap-1">
                    <mat-icon class="text-sm">rocket_launch</mat-icon>
                    Start Free Trial
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- For Developers -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div class="relative">
              <div class="h-48 bg-gradient-to-r from-[#0033A0] to-[#0047E0] flex items-center justify-center">
                <mat-icon class="text-white transform scale-[3]">code</mat-icon>
              </div>
            </div>
            <div class="p-8">
              <h2 class="text-3xl font-bold mb-4">
                For <span class="italic">Developers</span>
              </h2>
              <p class="text-gray-600 text-lg mb-8 min-h-[80px]">
                Join our global community of 26M+ developers. Practice, learn, and 
                advance your career with industry-leading resources.
              </p>
              <button routerLink="/login" 
                      class="w-full bg-[#0033A0] text-white py-4 rounded-xl text-lg font-medium mb-4 
                             hover:bg-[#0047E0] transition-colors flex items-center justify-center gap-2">
                <span>Start Your Journey</span>
                <mat-icon>arrow_forward</mat-icon>
              </button>
              <div class="text-center text-gray-600">
                Don't have an account?
                <div class="mt-3">
                  <a routerLink="/register" 
                     class="text-[#0033A0] hover:text-[#0047E0] font-medium flex items-center gap-1 justify-center">
                    <mat-icon class="text-sm">person_add</mat-icon>
                    Create Free Account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-[#0033A0] transform scale-150">verified</mat-icon>
            </div>
            <h3 class="text-xl font-semibold mb-2">Industry Standard</h3>
            <p class="text-gray-600">Trusted by leading technology companies worldwide</p>
          </div>
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-[#0033A0] transform scale-150">psychology</mat-icon>
            </div>
            <h3 class="text-xl font-semibold mb-2">AI-Powered</h3>
            <p class="text-gray-600">Advanced analytics and personalized learning paths</p>
          </div>
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-[#0033A0] transform scale-150">security</mat-icon>
            </div>
            <h3 class="text-xl font-semibold mb-2">Enterprise Ready</h3>
            <p class="text-gray-600">Secure, scalable, and compliant solutions</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="bg-white mt-20">
        <div class="container mx-auto px-4 py-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-sm text-gray-600">
              © {{currentYear}} Cognizant. All rights reserved.
            </div>
            <div class="flex items-center gap-6">
              <a routerLink="/privacy" class="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a>
              <a routerLink="/terms" class="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a>
              <a routerLink="/contact" class="text-gray-600 hover:text-gray-900 text-sm">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    mat-icon {
      width: 24px;
      height: 24px;
      font-size: 24px;
    }

    .text-sm mat-icon {
      width: 18px;
      height: 18px;
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .container {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
  `]
})
export class SelectionComponent {
  currentYear = new Date().getFullYear();
} 