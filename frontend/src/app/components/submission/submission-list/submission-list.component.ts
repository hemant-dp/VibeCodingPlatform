import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { SubmissionService, Submission } from '../../../services/submission.service';

@Component({
  selector: 'app-submission-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">Submissions</h1>
        <button mat-button color="primary" routerLink="/dashboard">
          <mat-icon>arrow_back</mat-icon> Back to Dashboard
        </button>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <!-- Filters -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Search by problem title</mat-label>
            <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilters()" placeholder="Search submissions">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
              <mat-option value="ALL">All Status</mat-option>
              <mat-option value="ACCEPTED">Accepted</mat-option>
              <mat-option value="WRONG_ANSWER">Wrong Answer</mat-option>
              <mat-option value="TIME_LIMIT_EXCEEDED">Time Limit Exceeded</mat-option>
              <mat-option value="MEMORY_LIMIT_EXCEEDED">Memory Limit Exceeded</mat-option>
              <mat-option value="COMPILATION_ERROR">Compilation Error</mat-option>
              <mat-option value="RUNTIME_ERROR">Runtime Error</mat-option>
              <mat-option value="PENDING">Pending</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Language</mat-label>
            <mat-select [(ngModel)]="languageFilter" (selectionChange)="applyFilters()">
              <mat-option value="ALL">All Languages</mat-option>
              <mat-option value="JAVA">Java</mat-option>
              <mat-option value="PYTHON">Python</mat-option>
              <mat-option value="CPP">C++</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="filteredSubmissions" class="w-full">
            <!-- Problem Column -->
            <ng-container matColumnDef="problem">
              <th mat-header-cell *matHeaderCellDef> Problem </th>
              <td mat-cell *matCellDef="let submission">
                <a [routerLink]="['/problems', submission.problemId]" class="text-[#0033A1] hover:underline">
                  {{ submission.problem?.title }}
                </a>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let submission">
                <mat-chip [ngClass]="getStatusClass(submission.status)">
                  {{ submission.status }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Language Column -->
            <ng-container matColumnDef="language">
              <th mat-header-cell *matHeaderCellDef> Language </th>
              <td mat-cell *matCellDef="let submission">
                {{ submission.language }}
              </td>
            </ng-container>

            <!-- Runtime Column -->
            <ng-container matColumnDef="runtime">
              <th mat-header-cell *matHeaderCellDef> Runtime </th>
              <td mat-cell *matCellDef="let submission">
                {{ submission.executionTimeMs ?? '-' }} ms
              </td>
            </ng-container>

            <!-- Memory Column -->
            <ng-container matColumnDef="memory">
              <th mat-header-cell *matHeaderCellDef> Memory </th>
              <td mat-cell *matCellDef="let submission">
                {{ submission.memoryUsedKb ? (submission.memoryUsedKb / 1024).toFixed(2) + ' MB' : '-' }}
              </td>
            </ng-container>

            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef> Submitted </th>
              <td mat-cell *matCellDef="let submission">
                {{ submission.submittedAt | date:'MMM d, y, h:mm a' }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                [routerLink]="['/submissions', row.id]" 
                class="hover:bg-gray-50 cursor-pointer"></tr>
          </table>

          <!-- Loading Spinner -->
          <div *ngIf="loading" class="flex justify-center items-center p-8">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <!-- No Submissions Message -->
          <div *ngIf="!loading && filteredSubmissions.length === 0" class="text-center py-8 text-gray-500">
            <mat-icon class="text-4xl mb-2">code</mat-icon>
            <p>No submissions found</p>
          </div>
        </div>
        
        <!-- Pagination -->
        <mat-paginator 
          [length]="submissions.length"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          aria-label="Select page of submissions">
        </mat-paginator>
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
    .mat-mdc-table {
      background: transparent;
    }
    .mat-mdc-header-cell {
      font-weight: 600;
      color: #4b5563;
      white-space: nowrap;
      padding: 16px;
    }
    .mat-mdc-cell {
      padding: 16px;
    }
  `]
})
export class SubmissionListComponent implements OnInit {
  submissions: Submission[] = [];
  filteredSubmissions: Submission[] = [];
  loading = true;
  displayedColumns = ['problem', 'status', 'language', 'runtime', 'memory', 'date'];
  
  // Filters
  searchTerm = '';
  statusFilter = 'ALL';
  languageFilter = 'ALL';
  
  // Pagination
  pageSize = 10;
  currentPage = 0;

  // Mock submissions data
  mockSubmissions: Submission[] = [
    {
      id: 1,
      problemId: 1,
      userId: 101,
      code: 'class Solution { /* Two Sum solution */ }',
      language: 'JAVA',
      status: 'ACCEPTED',
      executionTimeMs: 5,
      memoryUsedKb: 38400,
      submittedAt: new Date('2025-07-20T10:30:00'),
      problem: {
        id: 1,
        title: 'Two Sum',
        difficulty: 'EASY'
      },
      user: {
        id: 101,
        username: 'john_doe'
      }
    },
    {
      id: 2,
      problemId: 2,
      userId: 101,
      code: 'class Solution { /* Maximum Subarray solution */ }',
      language: 'PYTHON',
      status: 'ACCEPTED',
      executionTimeMs: 12,
      memoryUsedKb: 24576,
      submittedAt: new Date('2025-07-19T14:45:00'),
      problem: {
        id: 2,
        title: 'Maximum Subarray',
        difficulty: 'MEDIUM'
      },
      user: {
        id: 101,
        username: 'john_doe'
      }
    },
    {
      id: 3,
      problemId: 3,
      userId: 101,
      code: 'class Solution { /* Binary Tree Maximum Path Sum solution */ }',
      language: 'JAVA',
      status: 'WRONG_ANSWER',
      executionTimeMs: 8,
      memoryUsedKb: 41984,
      submittedAt: new Date('2025-07-18T16:20:00'),
      problem: {
        id: 3,
        title: 'Binary Tree Maximum Path Sum',
        difficulty: 'HARD'
      },
      user: {
        id: 101,
        username: 'john_doe'
      }
    },
    {
      id: 4,
      problemId: 1,
      userId: 101,
      code: 'class Solution { /* First attempt at Two Sum */ }',
      language: 'CPP',
      status: 'TIME_LIMIT_EXCEEDED',
      executionTimeMs: 500,
      memoryUsedKb: 20480,
      submittedAt: new Date('2025-07-17T09:15:00'),
      problem: {
        id: 1,
        title: 'Two Sum',
        difficulty: 'EASY'
      },
      user: {
        id: 101,
        username: 'john_doe'
      }
    },
    {
      id: 5,
      problemId: 10,
      userId: 101,
      code: 'class Solution { /* Container With Most Water solution */ }',
      language: 'PYTHON',
      status: 'COMPILATION_ERROR',
      compileOutput: 'SyntaxError: invalid syntax',
      submittedAt: new Date('2025-07-16T11:30:00'),
      problem: {
        id: 10,
        title: 'Container With Most Water',
        difficulty: 'MEDIUM'
      },
      user: {
        id: 101,
        username: 'john_doe'
      }
    }
  ];

  constructor(private submissionService: SubmissionService) {}

  ngOnInit(): void {
    this.loadSubmissions();
  }

  private loadSubmissions(): void {
    this.loading = true;
    
    // Use mock data instead of API call
    this.submissions = this.mockSubmissions;
    this.applyFilters();
    this.loading = false;
    
    // Keep this commented out for now, but it's the original API call
    /*
    this.submissionService.getSubmissions().subscribe({
      next: (submissions) => {
        this.submissions = submissions;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading submissions:', error);
        // Use mock data as fallback
        this.submissions = this.mockSubmissions;
        this.applyFilters();
        this.loading = false;
      }
    });
    */
  }
  
  // Apply filters to submissions
  applyFilters(): void {
    // Start with all submissions
    let result = [...this.submissions];
    
    // Apply search filter
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      result = result.filter(submission => 
        submission.problem?.title.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Apply status filter
    if (this.statusFilter !== 'ALL') {
      result = result.filter(submission => submission.status === this.statusFilter);
    }
    
    // Apply language filter
    if (this.languageFilter !== 'ALL') {
      result = result.filter(submission => submission.language === this.languageFilter);
    }
    
    // Update filtered submissions
    this.filteredSubmissions = result;
    this.currentPage = 0; // Reset to first page when filters change
  }
  
  // Get appropriate CSS class based on submission status
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
  
  // Handle pagination events
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }
} 