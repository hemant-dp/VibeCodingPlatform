import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Daily Streak -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-gray-600 font-normal mb-1">Daily Streak</h3>
                  <p class="text-4xl font-semibold text-[#0033A0]">15</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-[#0033A0] flex items-center justify-center">
                  <mat-icon class="text-white">local_fire_department</mat-icon>
                </div>
              </div>
              <div class="text-gray-600 mt-2">5 days best streak</div>
            </div>
            <div class="h-1.5 bg-[#0033A0] w-full"></div>
          </div>

          <!-- Problems Solved -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-gray-600 font-normal mb-1">Problems Solved</h3>
                  <p class="text-4xl font-semibold text-[#0033A0]">42</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-[#0033A0] flex items-center justify-center">
                  <mat-icon class="text-white">task_alt</mat-icon>
                </div>
              </div>
              <div class="text-gray-600 mt-2">12 this month</div>
            </div>
            <div class="h-1.5 bg-[#0033A0] w-full"></div>
          </div>

          <!-- Yearly Progress -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-gray-600 font-normal mb-1">Yearly Progress</h3>
                  <p class="text-4xl font-semibold text-[#0033A0]">75%</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-[#0033A0] flex items-center justify-center">
                  <mat-icon class="text-white">timeline</mat-icon>
                </div>
              </div>
              <div class="mt-4">
                <div class="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="absolute top-0 left-0 h-full bg-[#0033A0] rounded-full" style="width: 75%"></div>
                </div>
              </div>
            </div>
            <div class="h-1.5 bg-[#0033A0] w-full"></div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recent Problems -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-800">Recent Problems</h2>
                <a routerLink="/problems" class="text-[#0033A0] hover:underline flex items-center">
                  View All
                  <mat-icon class="ml-1 text-base">chevron_right</mat-icon>
                </a>
              </div>
              
              <!-- Problem Items -->
              <div class="space-y-4">
                <div *ngFor="let i of [1,2,3]" 
                     class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <mat-icon class="text-green-600">check_circle</mat-icon>
                    </div>
                    <div>
                      <h3 class="text-base font-medium text-gray-900">Two Sum</h3>
                      <p class="text-sm text-gray-500">Arrays & Hashing</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">Easy</div>
                    <button class="text-[#0033A0] hover:text-[#0033A0]/80 transition-colors duration-200">
                      <mat-icon>arrow_forward</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Activity Calendar -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-800">Activity</h2>
                <div class="text-sm text-gray-600">November 2023</div>
              </div>
              
              <!-- Calendar Grid -->
              <div class="calendar-container">
                <!-- Days Header -->
                <div class="grid grid-cols-7 mb-2">
                  <div *ngFor="let day of ['S', 'M', 'T', 'W', 'T', 'F', 'S']"
                       class="text-center text-xs font-medium text-gray-500">
                    {{day}}
                  </div>
                </div>

                <!-- Calendar Days -->
                <div class="grid grid-cols-7 gap-1">
                  <div *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35]"
                       class="calendar-day"
                       [class.active]="i === 5 || i === 12 || i === 15"
                       [class.light]="i === 8 || i === 19"
                       [class.medium]="i === 9 || i === 22 || i === 28">
                    {{i}}
                  </div>
                </div>

                <!-- Legend -->
                <div class="flex flex-wrap gap-2 mt-4">
                  <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 rounded bg-gray-100"></div>
                    <span class="text-xs text-gray-600">No activity</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 rounded bg-[#0033A0]/25"></div>
                    <span class="text-xs text-gray-600">1-2 problems</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 rounded bg-[#0033A0]"></div>
                    <span class="text-xs text-gray-600">3+ problems</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Submissions -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Submissions</h2>
              <div class="space-y-3">
                <div *ngFor="let i of [1,2,3]" 
                     class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <mat-icon class="text-green-600 text-sm">check_circle</mat-icon>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Two Sum</h4>
                    <p class="text-xs text-gray-500">2 minutes ago</p>
                  </div>
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
      width: 100%;
      overflow-x: hidden;
    }

    .calendar-container {
      max-width: 100%;
      overflow: hidden;
    }

    .calendar-day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      color: #4B5563;
      background-color: #F3F4F6;
      border-radius: 0.5rem;
      transition: transform 0.15s ease;
    }

    .calendar-day:hover {
      transform: scale(1.05);
    }

    .calendar-day.active {
      background-color: #0033A0;
      color: white;
    }

    .calendar-day.light {
      background-color: rgba(0, 51, 160, 0.25);
    }

    .calendar-day.medium {
      background-color: rgba(0, 51, 160, 0.75);
      color: white;
    }

    @media (max-width: 768px) {
      .container {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  ngOnInit() {
    // Initialize data
  }
} 