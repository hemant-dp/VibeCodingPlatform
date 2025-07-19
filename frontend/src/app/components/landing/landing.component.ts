import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
      <div class="container mx-auto px-4 py-16">
        <div class="flex flex-col items-center text-center space-y-8">
          <h1 class="text-5xl font-bold mb-4">Welcome to VibeCoding Platform</h1>
          <p class="text-xl mb-8 max-w-2xl">
            Master your coding skills with our comprehensive platform. Practice problems, 
            track your progress, and join a community of developers.
          </p>
          
          <!-- Trophy Button -->
          <a routerLink="/selection" class="transform hover:scale-110 transition-transform duration-300 cursor-pointer">
            <div class="bg-yellow-400 rounded-full p-8 shadow-lg hover:shadow-xl">
              <mat-icon class="text-6xl w-16 h-16 text-blue-900">emoji_events</mat-icon>
            </div>
            <p class="mt-4 text-lg font-semibold">Start Your Coding Journey</p>
          </a>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div class="p-6 bg-white bg-opacity-10 rounded-lg">
              <mat-icon class="text-4xl text-yellow-400">code</mat-icon>
              <h3 class="text-xl font-semibold mt-4">Practice Problems</h3>
              <p class="mt-2">Solve diverse coding challenges across different difficulty levels</p>
            </div>
            <div class="p-6 bg-white bg-opacity-10 rounded-lg">
              <mat-icon class="text-4xl text-yellow-400">trending_up</mat-icon>
              <h3 class="text-xl font-semibold mt-4">Track Progress</h3>
              <p class="mt-2">Monitor your improvement with detailed performance analytics</p>
            </div>
            <div class="p-6 bg-white bg-opacity-10 rounded-lg">
              <mat-icon class="text-4xl text-yellow-400">group</mat-icon>
              <h3 class="text-xl font-semibold mt-4">Join Community</h3>
              <p class="mt-2">Connect with fellow developers and share your solutions</p>
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
    mat-icon.text-4xl {
      transform: scale(1.5);
      height: 40px;
      width: 40px;
      font-size: 40px;
    }
    mat-icon.text-6xl {
      transform: scale(2);
      height: 48px;
      width: 48px;
      font-size: 48px;
    }
  `]
})
export class LandingComponent {} 