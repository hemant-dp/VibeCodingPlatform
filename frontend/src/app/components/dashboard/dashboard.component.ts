import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { ProblemService, Problem } from '../../services/problem.service';
import { SubmissionService, Submission } from '../../services/submission.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Recent Problems -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Recent Problems</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (recentProblems.length > 0) {
              <div class="space-y-2">
                @for (problem of recentProblems; track problem.id) {
                  <div class="p-2 border rounded hover:bg-gray-50">
                    <a [routerLink]="['/problems', problem.id]" class="flex justify-between items-center">
                      <div class="flex flex-col">
                        <span class="font-medium">{{ problem.title }}</span>
                        @if (problem.tags && problem.tags.length > 0) {
                          <div class="flex gap-1 mt-1">
                            @for (tag of problem.tags.slice(0, 2); track tag) {
                              <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">{{ tag }}</span>
                            }
                            @if (problem.tags.length > 2) {
                              <span class="text-xs text-gray-500">+{{ problem.tags.length - 2 }}</span>
                            }
                          </div>
                        }
                      </div>
                      <mat-chip [ngClass]="getDifficultyClass(problem.difficulty)">
                        {{ problem.difficulty }}
                      </mat-chip>
                    </a>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-8 text-gray-500">
                <mat-icon class="text-4xl mb-2">assignment</mat-icon>
                <p>No recent problems available.</p>
              </div>
            }
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/problems">View All Problems</button>
          </mat-card-actions>
        </mat-card>

        <!-- Recent Submissions -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Recent Submissions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (recentSubmissions.length > 0) {
              <div class="space-y-2">
                @for (submission of recentSubmissions; track submission.id) {
                  <div class="p-2 border rounded hover:bg-gray-50">
                    <div class="flex justify-between items-center">
                      <div class="flex flex-col">
                        <span class="font-medium">{{ submission.problem?.title }}</span>
                        <span class="text-sm text-gray-500">
                          {{ submission.submittedAt | date:'MMM d, y, h:mm a' }}
                        </span>
                      </div>
                      <mat-chip [ngClass]="getStatusClass(submission.status)">
                        {{ submission.status }}
                      </mat-chip>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-8 text-gray-500">
                <mat-icon class="text-4xl mb-2">code</mat-icon>
                <p>No recent submissions available.</p>
              </div>
            }
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/submissions">View All Submissions</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .container {
      max-width: 1200px;
    }
    mat-card {
      margin-bottom: 1rem;
    }
    .mat-mdc-card-header {
      padding: 16px;
    }
    .mat-mdc-card-content {
      padding: 0 16px;
      min-height: 300px;
    }
    .mat-mdc-card-actions {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class DashboardComponent implements OnInit {
  recentProblems: Problem[] = [];
  recentSubmissions: Submission[] = [];

  constructor(
    private problemService: ProblemService,
    private submissionService: SubmissionService
  ) {}

  ngOnInit(): void {
    this.loadRecentProblems();
    this.loadRecentSubmissions();
  }

  private loadRecentProblems(): void {
    this.problemService.getRecentProblems(5).pipe(
      catchError(error => {
        console.error('Error loading recent problems:', error);
        return of([]);
      })
    ).subscribe(problems => {
      this.recentProblems = problems;
    });
  }

  private loadRecentSubmissions(): void {
    this.submissionService.getRecentSubmissions(5).pipe(
      catchError(error => {
        console.error('Error loading recent submissions:', error);
        return of([]);
      })
    ).subscribe(submissions => {
      this.recentSubmissions = submissions;
    });
  }

  getDifficultyClass(difficulty: string): string {
    const baseClasses = 'text-sm font-medium';
    switch (difficulty) {
      case 'EASY':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'MEDIUM':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'HARD':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  getStatusClass(status: string): string {
    const baseClasses = 'text-sm font-medium';
    switch (status) {
      case 'ACCEPTED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'WRONG_ANSWER':
      case 'COMPILATION_ERROR':
      case 'RUNTIME_ERROR':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'TIME_LIMIT_EXCEEDED':
      case 'MEMORY_LIMIT_EXCEEDED':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'PENDING':
      case 'RUNNING':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }
} 