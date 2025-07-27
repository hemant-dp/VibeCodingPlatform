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
    <div class="min-h-screen bg-white py-8">
      <div class="container mx-auto px-4">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
            <div class="h-2 bg-[#0033A0] w-full"></div>
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
            <div class="h-2 bg-[#0033A0] w-full"></div>
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
            <div class="h-2 bg-[#0033A0] w-full"></div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Recent Problems -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-normal text-gray-800">Recent Problems</h2>
                <a routerLink="/problems" class="text-[#0033A0] hover:underline flex items-center">
                  View All
                  <mat-icon class="ml-1 text-sm">chevron_right</mat-icon>
                </a>
              </div>

              <!-- Problem Items -->
              <div class="space-y-4">
                <div *ngFor="let i of [1,2]" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <mat-icon class="text-green-600">check_circle</mat-icon>
                    </div>
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">Two Sum</h3>
                      <p class="text-gray-500">Arrays & Hashing</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="px-4 py-1 rounded-full bg-gray-200 text-gray-700">Easy</div>
                    <button class="text-[#0033A0]">
                      <mat-icon>arrow_forward</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <!-- Activity Calendar -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-normal text-gray-800">Activity Calendar</h2>
                <div class="text-sm text-gray-600">November 2023</div>
              </div>
              <div class="flex flex-col gap-2">
                <!-- Calendar Header -->
                <div class="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
                  <div class="text-center">Sun</div>
                  <div class="text-center">Mon</div>
                  <div class="text-center">Tue</div>
                  <div class="text-center">Wed</div>
                  <div class="text-center">Thu</div>
                  <div class="text-center">Fri</div>
                  <div class="text-center">Sat</div>
                </div>
                <!-- Calendar Grid -->
                <div class="grid grid-cols-7 gap-1.5">
                  <!-- Week 1 -->
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">29</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">30</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">31</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">1</div>
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0] flex items-center justify-center text-xs text-white">2</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">3</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">4</div>
                  <!-- Week 2 -->
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0]/25 flex items-center justify-center text-xs text-gray-600">5</div>
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0]/75 flex items-center justify-center text-xs text-white">6</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">7</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">8</div>
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0] flex items-center justify-center text-xs text-white">9</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">10</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">11</div>
                  <!-- Week 3 -->
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0] flex items-center justify-center text-xs text-white">12</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">13</div>
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0]/50 flex items-center justify-center text-xs text-white">14</div>
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0] flex items-center justify-center text-xs text-white">15</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">16</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">17</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">18</div>
                  <!-- Week 4 -->
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0]/25 flex items-center justify-center text-xs text-gray-600">19</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">20</div>
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0] flex items-center justify-center text-xs text-white">21</div>
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0]/75 flex items-center justify-center text-xs text-white">22</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">23</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">24</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">25</div>
                  <!-- Week 5 -->
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">26</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">27</div>
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0]/50 flex items-center justify-center text-xs text-white">28</div>
                  <div class="w-8 h-8 rounded-lg bg-[#0033A0]/75 flex items-center justify-center text-xs text-white">29</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">30</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">1</div>
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">2</div>
                </div>
                <!-- Calendar Legend -->
                <div class="flex items-center justify-start gap-3 mt-4 text-xs text-gray-600">
                  <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded bg-gray-100"></div>
                    <span>No activity</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded bg-[#0033A0]/25"></div>
                    <span>1-2 problems</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded bg-[#0033A0]"></div>
                    <span>3+ problems</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Submissions -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-normal text-gray-800 mb-6">Recent Submissions</h2>
              <div class="space-y-4">
                <div *ngFor="let i of [1,2]" class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <mat-icon class="text-green-600 text-sm">check_circle</mat-icon>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">Two Sum</h4>
                    <p class="text-sm text-gray-500">2 minutes ago</p>
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
    }

    /* Icon size adjustments */
    .text-sm {
      font-size: 18px;
      height: 18px;
      width: 18px;
      line-height: 18px;
    }

    /* Responsive Adjustments */
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