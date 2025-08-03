import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ActivityService, ActivityData, ActivitySummary } from '../../services/activity.service';

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
    MatChipsModule,
    MatSelectModule,
    MatOptionModule,
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="mx-auto px-4 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Daily Streak -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-gray-600 font-normal mb-1">Current Streak</h3>
                  <p class="text-4xl font-semibold text-[#0033A0]">
                    {{ activitySummary?.currentStreak || 0 }}
                  </p>
                </div>
                <div
                  class="w-12 h-12 rounded-full bg-[#0033A0] flex items-center justify-center"
                >
                  <mat-icon class="text-white">local_fire_department</mat-icon>
                </div>
              </div>
              <div class="text-gray-600 mt-2">
                {{ activitySummary?.longestStreak || 0 }} days best streak
              </div>
            </div>
            <div class="h-1.5 bg-[#0033A0] w-full"></div>
          </div>

          <!-- Problems Solved -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-gray-600 font-normal mb-1">
                    Total Accepted
                  </h3>
                  <p class="text-4xl font-semibold text-[#0033A0]">
                    {{ activitySummary?.totalAccepted || 0 }}
                  </p>
                </div>
                <div
                  class="w-12 h-12 rounded-full bg-[#0033A0] flex items-center justify-center"
                >
                  <mat-icon class="text-white">task_alt</mat-icon>
                </div>
              </div>
              <div class="text-gray-600 mt-2">
                {{ activitySummary?.totalSubmissions || 0 }} total submissions
              </div>
            </div>
            <div class="h-1.5 bg-[#0033A0] w-full"></div>
          </div>

          <!-- Active Days -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-gray-600 font-normal mb-1">
                    Active Days
                  </h3>
                  <p class="text-4xl font-semibold text-[#0033A0]">
                    {{ activitySummary?.activeDays || 0 }}
                  </p>
                </div>
                <div
                  class="w-12 h-12 rounded-full bg-[#0033A0] flex items-center justify-center"
                >
                  <mat-icon class="text-white">timeline</mat-icon>
                </div>
              </div>
              <div class="mt-4">
                <div
                  class="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden"
                >
                  <div
                    class="absolute top-0 left-0 h-full bg-[#0033A0] rounded-full"
                    [style.width.%]="getYearlyProgress()"
                  ></div>
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
                <h2 class="text-xl font-semibold text-gray-800">
                  Recent Problems
                </h2>
                <a
                  routerLink="/problems"
                  class="text-[#0033A0] hover:underline flex items-center"
                >
                  View All
                  <mat-icon class="ml-1 text-base">chevron_right</mat-icon>
                </a>
              </div>

              <!-- Problem Items -->
              <div class="space-y-4">
                <div
                  *ngFor="let i of [1, 2, 3]"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"
                    >
                      <mat-icon class="text-green-600">check_circle</mat-icon>
                    </div>
                    <div>
                      <h3 class="text-base font-medium text-gray-900">
                        Two Sum
                      </h3>
                      <p class="text-sm text-gray-500">Arrays & Hashing</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div
                      class="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm"
                    >
                      Easy
                    </div>
                    <button
                      class="text-[#0033A0] hover:text-[#0033A0]/80 transition-colors duration-200"
                    >
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
                <mat-select [value]="selectedYear" (selectionChange)="onYearChange($event.value)" class="text-sm">
                  <mat-option *ngFor="let year of availableYears" [value]="year">
                    {{ year }}
                  </mat-option>
                </mat-select>
              </div>

              <!-- Month Navigation -->
              <div class="flex justify-between items-center mb-4">
                <button mat-icon-button (click)="previousMonth()" class="text-gray-600 hover:text-[#0033A0]">
                  <mat-icon>chevron_left</mat-icon>
                </button>
                <div class="text-lg font-medium text-gray-800">
                  {{ getMonthName(selectedMonth) }} {{ selectedYear }}
                </div>
                <button mat-icon-button (click)="nextMonth()" class="text-gray-600 hover:text-[#0033A0]">
                  <mat-icon>chevron_right</mat-icon>
                </button>
              </div>

              <!-- Calendar Grid -->
              <div class="calendar-container">
                <div *ngIf="loading" class="flex justify-center items-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0033A0]"></div>
                </div>
                
                <div *ngIf="!loading">
                  <!-- Days Header -->
                  <div class="grid grid-cols-7 mb-2">
                    <div
                      *ngFor="let day of dayHeaders"
                      class="text-center text-xs font-medium text-gray-500 p-1"
                    >
                      {{ day }}
                    </div>
                  </div>

                  <!-- Calendar Days -->
                  <div class="grid grid-cols-7 gap-1">
                    <div
                      *ngFor="let day of calendarDays"
                      class="calendar-day"
                      [class.current-month]="day.isCurrentMonth"
                      [class.other-month]="!day.isCurrentMonth"
                      [class.activity-none]="day.isCurrentMonth && day.activityLevel === 0"
                      [class.activity-light]="day.isCurrentMonth && day.activityLevel === 1"
                      [class.activity-medium]="day.isCurrentMonth && day.activityLevel === 2"
                      [class.activity-high]="day.isCurrentMonth && day.activityLevel === 3"
                      [title]="getActivityTooltip(day)"
                    >
                      {{ day.date }}
                    </div>
                  </div>
                </div>

                <!-- Legend -->
                <div class="flex flex-wrap gap-3 mt-4 justify-center">
                  <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 rounded activity-none"></div>
                    <span class="text-xs text-gray-600">No activity</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 rounded activity-light"></div>
                    <span class="text-xs text-gray-600">1-2 submissions</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 rounded activity-medium"></div>
                    <span class="text-xs text-gray-600">3-5 submissions</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 rounded activity-high"></div>
                    <span class="text-xs text-gray-600">6+ submissions</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Submissions -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Recent Submissions
              </h2>
              <div class="space-y-3">
                <div
                  *ngFor="let i of [1, 2, 3]"
                  class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <mat-icon class="text-green-600 text-sm"
                      >check_circle</mat-icon
                    >
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
  styles: [
    `
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
        color: #4b5563;
        border-radius: 0.25rem;
        transition: all 0.15s ease;
        cursor: pointer;
        position: relative;
      }

      .calendar-day:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .calendar-day.current-month {
        color: #1f2937;
      }

      .calendar-day.other-month {
        color: #d1d5db;
        background-color: #f9fafb;
      }

      /* Activity levels */
      .activity-none {
        background-color: #e5e7eb;
      }

      .activity-light {
        background-color: rgba(0, 51, 160, 0.3);
        color: #1f2937;
      }

      .activity-medium {
        background-color: rgba(0, 51, 160, 0.6);
        color: white;
      }

      .activity-high {
        background-color: #0033a0;
        color: white;
      }

      .calendar-day.activity-none:hover {
        background-color: #d1d5db;
      }

      .calendar-day.activity-light:hover {
        background-color: rgba(0, 51, 160, 0.4);
      }

      .calendar-day.activity-medium:hover {
        background-color: rgba(0, 51, 160, 0.7);
      }

      .calendar-day.activity-high:hover {
        background-color: #002d8a;
      }

      /* Year selector styling */
      .mat-mdc-select {
        font-size: 0.875rem;
        min-width: 80px;
      }

      .mat-mdc-select-value {
        color: #374151;
      }

      /* Month navigation buttons */
      .mat-mdc-icon-button {
        width: 32px;
        height: 32px;
        line-height: 32px;
      }

      .mat-mdc-icon-button mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      @media (max-width: 768px) {
        .container {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .calendar-day {
          font-size: 0.625rem;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  // Calendar properties
  currentDate = new Date();
  selectedYear = this.currentDate.getFullYear();
  selectedMonth = this.currentDate.getMonth(); // 0-based (0 = January)
  availableYears: number[] = [];
  dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];
  
  // Activity data
  activityData: { [key: string]: ActivityData } = {};
  activitySummary: ActivitySummary | null = null;
  loading = false;

  constructor(private activityService: ActivityService) {}

  ngOnInit() {
    this.initializeYears();
    this.loadActivitySummary();
    this.loadMonthlyActivity();
  }

  private initializeYears() {
    const currentYear = this.currentDate.getFullYear();
    this.availableYears = [currentYear - 1, currentYear, currentYear + 1];
  }

  private loadActivitySummary() {
    this.activityService.getActivitySummary().subscribe({
      next: (summary) => {
        this.activitySummary = summary;
      },
      error: (error) => {
        console.error('Error loading activity summary:', error);
      }
    });
  }

  private loadMonthlyActivity() {
    this.loading = true;
    console.log('Loading activity for:', this.selectedYear, this.selectedMonth + 1); // +1 because month is 0-based
    
    this.activityService.getMonthlyActivity(this.selectedYear, this.selectedMonth).subscribe({
      next: (activities) => {
        console.log('Received activities:', activities);
        
        // Convert array to lookup object
        this.activityData = {};
        activities.forEach(activity => {
          console.log('Processing activity:', activity);
          this.activityData[activity.date] = activity;
        });
        
        console.log('Activity data lookup:', this.activityData);
        this.generateCalendar();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading monthly activity:', error);
        this.loading = false;
        // Generate calendar with empty data
        this.generateCalendar();
      }
    });
  }

  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
    const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    const startDate = new Date(firstDay);
    
    // Start from the first Sunday of the week containing the first day
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    console.log('Generating calendar for:', this.selectedYear, this.selectedMonth);
    console.log('Available activity data:', Object.keys(this.activityData));
    
    // Generate 42 days (6 weeks) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === this.selectedMonth;
      const dateKey = this.formatDateKey(currentDate);
      const activityInfo = this.activityData[dateKey];
      const submissionCount = activityInfo ? activityInfo.submissionCount : 0;
      
      // Special debugging for August 3rd
      if (currentDate.getDate() === 3 && currentDate.getMonth() === 7) { // August is month 7 (0-based)
        console.log('=== August 3rd Debug ===');
        console.log('Date key:', dateKey);
        console.log('Activity info:', activityInfo);
        console.log('Submission count:', submissionCount);
        console.log('Activity level:', this.getActivityLevel(submissionCount));
        console.log('Is current month:', isCurrentMonth);
        console.log('All activity data keys:', Object.keys(this.activityData));
      }
      
      if (isCurrentMonth && submissionCount > 0) {
        console.log(`Date ${dateKey} has ${submissionCount} submissions, activity level: ${this.getActivityLevel(submissionCount)}`);
      }
      
      this.calendarDays.push({
        date: currentDate.getDate(),
        fullDate: new Date(currentDate),
        isCurrentMonth,
        activityLevel: this.getActivityLevel(submissionCount),
        problemCount: submissionCount,
        acceptedCount: activityInfo ? activityInfo.acceptedCount : 0,
        totalProblems: activityInfo ? activityInfo.totalProblems : 0
      });
    }
    
    console.log('Generated calendar days with activity:', this.calendarDays.filter(d => d.activityLevel > 0));
  }

  private formatDateKey(date: Date): string {
    const formatted = date.toISOString().split('T')[0];
    return formatted;
  }

  private getActivityLevel(problemCount: number): number {
    if (problemCount === 0) return 0;
    if (problemCount <= 2) return 1;
    if (problemCount <= 5) return 2;
    return 3;
  }

  getActivityTooltip(day: CalendarDay): string {
    if (!day.isCurrentMonth) return '';
    
    const date = day.fullDate.toLocaleDateString();
    const submissions = day.problemCount;
    const accepted = day.acceptedCount;
    const problems = day.totalProblems;
    
    if (submissions === 0) {
      return `${date}: No activity`;
    }
    
    let tooltip = `${date}:\n`;
    tooltip += `${submissions} submission${submissions !== 1 ? 's' : ''}`;
    
    if (accepted > 0) {
      tooltip += `\n${accepted} accepted`;
    }
    
    if (problems > 0 && problems !== submissions) {
      tooltip += `\n${problems} unique problem${problems !== 1 ? 's' : ''}`;
    }
    
    return tooltip;
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  }

  onYearChange(year: number) {
    this.selectedYear = year;
    this.loadMonthlyActivity();
  }

  previousMonth() {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
      // Update available years if we went to previous year
      if (!this.availableYears.includes(this.selectedYear)) {
        this.availableYears = [this.selectedYear, this.selectedYear + 1, this.selectedYear + 2];
      }
    } else {
      this.selectedMonth--;
    }
    this.loadMonthlyActivity();
  }

  nextMonth() {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
      // Update available years if we went to next year
      if (!this.availableYears.includes(this.selectedYear)) {
        this.availableYears = [this.selectedYear - 1, this.selectedYear, this.selectedYear + 1];
      }
    } else {
      this.selectedMonth++;
    }
    this.loadMonthlyActivity();
  }
  
  getYearlyProgress(): number {
    if (!this.activitySummary) return 0;
    
    // Calculate progress as percentage of days in year that have activity
    const daysInYear = this.isLeapYear(this.currentDate.getFullYear()) ? 366 : 365;
    const activeDays = this.activitySummary.activeDays;
    
    return Math.min(100, (activeDays / daysInYear) * 100);
  }
  
  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }
}

interface CalendarDay {
  date: number;
  fullDate: Date;
  isCurrentMonth: boolean;
  activityLevel: number; // 0-3 representing activity intensity
  problemCount: number; // Total submissions for the day
  acceptedCount: number; // Number of accepted submissions
  totalProblems: number; // Number of unique problems attempted
}
