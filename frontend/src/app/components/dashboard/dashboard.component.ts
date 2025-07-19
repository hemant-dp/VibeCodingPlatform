import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { ProblemService, Problem } from '../../services/problem.service';
import { SubmissionService, Submission } from '../../services/submission.service';

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
                      <span>{{ problem.title }}</span>
                      <mat-chip [color]="getDifficultyColor(problem.difficulty)">
                        {{ problem.difficulty }}
                      </mat-chip>
                    </a>
                  </div>
                }
              </div>
            } @else {
              <p>No recent problems available.</p>
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
                      <span>{{ submission.problem?.title }}</span>
                      <mat-chip [color]="getStatusColor(submission.status)">
                        {{ submission.status }}
                      </mat-chip>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ submission.submittedAt | date:'short' }}
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p>No recent submissions available.</p>
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
    this.problemService.getRecentProblems(5).subscribe({
      next: (problems) => {
        this.recentProblems = problems;
      },
      error: (error) => {
        console.error('Error loading recent problems:', error);
      }
    });
  }

  private loadRecentSubmissions(): void {
    this.submissionService.getRecentSubmissions(5).subscribe({
      next: (submissions) => {
        this.recentSubmissions = submissions;
      },
      error: (error) => {
        console.error('Error loading recent submissions:', error);
      }
    });
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'EASY':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'HARD':
        return 'error';
      default:
        return 'primary';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'WRONG_ANSWER':
      case 'COMPILATION_ERROR':
      case 'RUNTIME_ERROR':
        return 'error';
      case 'TIME_LIMIT_EXCEEDED':
      case 'MEMORY_LIMIT_EXCEEDED':
        return 'warning';
      default:
        return 'primary';
    }
  }
} 