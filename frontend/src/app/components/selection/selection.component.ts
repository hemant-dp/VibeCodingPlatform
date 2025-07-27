import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Companies Section -->
          <div class="bg-white rounded-lg shadow-lg p-8 relative">
            <div class="absolute -top-4 left-8">
              <span class="bg-black text-white text-sm font-medium px-4 py-1 rounded">
                BUSINESS
              </span>
            </div>
            <h2 class="text-3xl font-bold mb-2">
              For <span class="italic">Companies</span>
            </h2>
            <p class="text-gray-600 mb-8 text-lg">
              Thousands of companies have embraced the new way to hire
              and upskill developers across roles and throughout their careers.
            </p>
            <div class="space-y-4">
              <button mat-raised-button color="primary" class="w-full" routerLink="/login">
                Login
              </button>
              <div class="text-center text-sm text-gray-600">
                Don't have an account?
                <div class="mt-2">
                  <a class="text-green-600 hover:text-green-700 font-medium" href="#">Contact sales</a>
                  <span class="mx-2">or</span>
                  <a class="text-green-600 hover:text-green-700 font-medium" href="#">Get free trial</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Developers Section -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold mb-2">
              For <span class="italic">Developers</span>
            </h2>
            <p class="text-gray-600 mb-8 text-lg">
              Join over 26 million developers, practice coding
              skills, prepare for interviews, and get hired.
            </p>
            <div class="space-y-4">
              <button mat-raised-button color="primary" class="w-full" routerLink="/login">
                Login
              </button>
              <div class="text-center text-sm text-gray-600">
                Don't have an account?
                <div class="mt-2">
                  <a class="text-green-600 hover:text-green-700 font-medium" routerLink="/register">Sign up</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .mat-mdc-raised-button {
      height: 48px;
      font-size: 1rem;
    }
  `]
})
export class SelectionComponent {} 