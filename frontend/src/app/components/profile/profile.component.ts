import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, User } from '../../services/auth.service';
import { SubmissionService } from '../../services/submission.service';
import { Submission } from '../../services/submission.service';

interface Badge {
  name: string;
  level: number;
  icon: string;
  color: string;
}

interface Stats {
  solved: number;
  totalProblems: number;
  easy: number;
  medium: number;
  hard: number;
  submissions: number;
  acceptanceRate: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">Profile</h1>
        <button mat-button color="primary" routerLink="/dashboard">
          <mat-icon>arrow_back</mat-icon> Back to Dashboard
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-1">
          <!-- Profile Card -->
          <mat-card class="mb-6">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="w-20 h-20 rounded-full bg-[#0033A1] text-white flex items-center justify-center text-3xl font-semibold">
                  {{ userInitials }}
                </div>
                <div class="ml-4">
                  <h2 class="text-2xl font-semibold">{{ user?.username }}</h2>
                  <p class="text-gray-600">{{ formattedUsername }}</p>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center text-gray-600">
                  <mat-icon class="mr-2">email</mat-icon>
                  <span>{{ user?.email }}</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <mat-icon class="mr-2">badge</mat-icon>
                  <span>{{ user?.role }}</span>
                </div>
              </div>
            </div>
          </mat-card>

          <!-- Badges Card -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Badges</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="grid grid-cols-3 gap-4">
                @for (badge of badges; track badge.name) {
                  <div class="flex flex-col items-center">
                    <div [class]="'w-16 h-16 rounded-full flex items-center justify-center ' + badge.color">
                      <mat-icon class="text-3xl">{{ badge.icon }}</mat-icon>
                    </div>
                    <span class="mt-2 text-sm font-medium">{{ badge.name }}</span>
                    <div class="flex">
                      @for (star of [].constructor(badge.level); track $index) {
                        <mat-icon class="text-yellow-400 text-sm">star</mat-icon>
                      }
                    </div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Right Column -->
        <div class="lg:col-span-2">
          <!-- Stats Card -->
          <mat-card class="mb-6">
            <mat-card-header>
              <mat-card-title>Problem Solving Progress</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <!-- Overall Progress -->
              <div class="mb-8 text-center">
                <div class="inline-block relative">
                  <mat-progress-spinner
                    [value]="(stats.solved / stats.totalProblems) * 100"
                    [diameter]="150"
                    color="primary"
                  ></mat-progress-spinner>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div class="text-3xl font-bold text-[#0033A1]">{{ stats.solved }}</div>
                      <div class="text-sm text-gray-600">Solved</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Difficulty Breakdown -->
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-green-600 font-medium">Easy</span>
                    <span class="text-gray-600">{{ stats.easy }} solved</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded">
                    <div class="h-2 bg-green-500 rounded" [style.width.%]="(stats.easy / stats.totalProblems) * 100"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-yellow-600 font-medium">Medium</span>
                    <span class="text-gray-600">{{ stats.medium }} solved</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded">
                    <div class="h-2 bg-yellow-500 rounded" [style.width.%]="(stats.medium / stats.totalProblems) * 100"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-red-600 font-medium">Hard</span>
                    <span class="text-gray-600">{{ stats.hard }} solved</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded">
                    <div class="h-2 bg-red-500 rounded" [style.width.%]="(stats.hard / stats.totalProblems) * 100"></div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Recent Activity Card -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Recent Activity</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="space-y-4">
                @for (submission of recentSubmissions; track submission.id) {
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                      <a [routerLink]="['/problems', submission.problemId]" class="text-[#0033A1] hover:underline font-medium">
                        {{ submission.problem?.title }}
                      </a>
                      <div class="text-sm text-gray-600">{{ submission.submittedAt | date:'medium' }}</div>
                    </div>
                    <mat-chip [ngClass]="getStatusClass(submission.status)">
                      {{ submission.status }}
                    </mat-chip>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    .mat-mdc-card {
      --mdc-elevated-card-container-color: white;
    }

    .mat-mdc-progress-spinner {
      --mdc-circular-progress-active-indicator-color: #0033A1;
    }

    ::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }

    * {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .container {
      max-width: 100%;
      padding-right: 1rem;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  badges: Badge[] = [
    { name: 'Problem Solving', level: 3, icon: 'psychology', color: 'bg-blue-100 text-blue-600' },
    { name: 'Java', level: 5, icon: 'code', color: 'bg-orange-100 text-orange-600' },
    { name: 'SQL', level: 4, icon: 'storage', color: 'bg-green-100 text-green-600' },
    { name: 'Python', level: 3, icon: 'data_object', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Angular', level: 4, icon: 'web', color: 'bg-red-100 text-red-600' },
    { name: 'Spring', level: 3, icon: 'deployed_code', color: 'bg-green-100 text-green-600' }
  ];

  stats: Stats = {
    solved: 43,
    totalProblems: 100,
    easy: 20,
    medium: 15,
    hard: 8,
    submissions: 65,
    acceptanceRate: 66.15
  };

  recentSubmissions: Submission[] = [];

  constructor(
    private authService: AuthService,
    private submissionService: SubmissionService
  ) {}

  ngOnInit() {
    // Subscribe to user changes
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('Current user:', user); // Debug log
    });

    // Load recent submissions
    this.submissionService.getRecentSubmissions(5).subscribe(submissions => {
      this.recentSubmissions = submissions;
      console.log('Recent submissions:', submissions); // Debug log
    });
  }

  get userInitials(): string {
    if (!this.user?.username) return '';
    const username = this.user.username;
    // Get first letter and last letter
    if (username.length === 1) {
      return username.toUpperCase();
    }
    return (username.charAt(0) + username.charAt(username.length - 1)).toUpperCase();
  }

  get formattedUsername(): string {
    return this.user ? `@${this.user.username}` : '';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'WRONG_ANSWER':
        return 'bg-red-100 text-red-800';
      case 'COMPILATION_ERROR':
        return 'bg-yellow-100 text-yellow-800';
      case 'RUNTIME_ERROR':
        return 'bg-orange-100 text-orange-800';
      case 'PENDING':
      case 'RUNNING':
      case 'COMPILING':
        return 'bg-blue-100 text-blue-800';
      case 'TIME_LIMIT_EXCEEDED':
      case 'MEMORY_LIMIT_EXCEEDED':
        return 'bg-purple-100 text-purple-800';
      case 'JUDGE_ERROR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
} 