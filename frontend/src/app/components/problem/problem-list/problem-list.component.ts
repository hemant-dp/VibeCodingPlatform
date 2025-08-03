import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProblemService, Problem } from '../../../services/problem.service';
import { ProblemStateService } from '../../../services/problem-state.service';

@Component({
  selector: 'app-problem-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">Problem List</h1>
        <button mat-button color="primary" routerLink="/dashboard">
          <mat-icon>arrow_back</mat-icon> Back to Dashboard
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <!-- Filters -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Search problems</mat-label>
              <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilters()" placeholder="Search by title or tag">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Difficulty</mat-label>
              <mat-select [(ngModel)]="difficultyFilter" (selectionChange)="applyFilters()">
                <mat-option value="ALL">All Difficulties</mat-option>
                <mat-option value="EASY">Easy</mat-option>
                <mat-option value="MEDIUM">Medium</mat-option>
                <mat-option value="HARD">Hard</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Status</mat-label>
              <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
                <mat-option value="ALL">All Problems</mat-option>
                <mat-option value="SOLVED">Solved</mat-option>
                <mat-option value="UNSOLVED">Unsolved</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="filteredProblems" class="w-full">
              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef class="w-16"> Status </th>
                <td mat-cell *matCellDef="let problem" class="w-16">
                  <mat-icon *ngIf="problem.solved" class="text-green-600">check_circle</mat-icon>
                </td>
              </ng-container>

              <!-- Title Column -->
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef> Title </th>
                <td mat-cell *matCellDef="let problem">
                  <a [routerLink]="['/problems', problem.id]" class="text-[#0033A1] hover:underline">
                    {{ problem.title }}
                  </a>
                </td>
              </ng-container>

              <!-- Difficulty Column -->
              <ng-container matColumnDef="difficulty">
                <th mat-header-cell *matHeaderCellDef> Difficulty </th>
                <td mat-cell *matCellDef="let problem">
                  <span [ngClass]="{
                    'text-green-600': problem.difficulty === 'EASY',
                    'text-yellow-600': problem.difficulty === 'MEDIUM',
                    'text-red-600': problem.difficulty === 'HARD'
                  }">
                    {{ problem.difficulty }}
                  </span>
                </td>
              </ng-container>

              <!-- Tags Column -->
              <ng-container matColumnDef="tags">
                <th mat-header-cell *matHeaderCellDef> Tags </th>
                <td mat-cell *matCellDef="let problem">
                  <mat-chip-set>
                    <mat-chip *ngFor="let tag of problem.tags.slice(0, 3)" class="bg-gray-100 text-xs">
                      {{ tag }}
                    </mat-chip>
                    <span *ngIf="problem.tags.length > 3" class="text-xs text-gray-500">+{{ problem.tags.length - 3 }}</span>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Acceptance Rate Column -->
              <ng-container matColumnDef="acceptanceRate">
                <th mat-header-cell *matHeaderCellDef class="w-32"> Acceptance </th>
                <td mat-cell *matCellDef="let problem" class="w-32">
                  {{ problem.acceptanceRate }}%
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  [routerLink]="['/problems', row.id]" 
                  class="cursor-pointer hover:bg-gray-50"></tr>
            </table>

            <!-- Loading Spinner -->
            <div *ngIf="loading" class="flex justify-center items-center p-8">
              <mat-spinner diameter="40"></mat-spinner>
            </div>

            <!-- No Problems Message -->
            <div *ngIf="!loading && filteredProblems.length === 0" class="text-center py-8 text-gray-500">
              No problems found matching your filters
            </div>
          </div>
          
          <!-- Pagination -->
          <mat-paginator 
            [length]="problems.length"
            [pageSize]="pageSize"
            [pageSizeOptions]="[10, 25, 50, 100]"
            (page)="onPageChange($event)"
            aria-label="Select page of problems">
          </mat-paginator>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .mat-mdc-table {
      background: transparent;
    }

    .mat-mdc-row:hover {
      background-color: #f8fafc;
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
export class ProblemListComponent implements OnInit, OnDestroy {
  // All problems
  problems: Problem[] = [];
  // Filtered problems (for display)
  filteredProblems: Problem[] = [];
  loading = true;
  displayedColumns = ['status', 'title', 'difficulty', 'tags', 'acceptanceRate'];
  private subscriptions = new Subscription();
  
  // Filters
  searchTerm = '';
  difficultyFilter = 'ALL';
  statusFilter = 'ALL';
  
  // Pagination
  pageSize = 25;
  currentPage = 0;

  // Mock data for problems
  mockProblems: Problem[] = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'EASY',
      tags: ['Array', 'Hash Table'],
      acceptanceRate: 78,
      solved: true
    },
    {
      id: 2,
      title: 'Maximum Subarray',
      difficulty: 'MEDIUM',
      tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
      acceptanceRate: 65,
      solved: false
    },
    {
      id: 3,
      title: 'Binary Tree Maximum Path Sum',
      difficulty: 'HARD',
      tags: ['Binary Tree', 'DFS', 'Dynamic Programming'],
      acceptanceRate: 47,
      solved: false
    },
    {
      id: 4,
      title: 'FizzBuzz',
      difficulty: 'EASY',
      tags: ['Math', 'String'],
      acceptanceRate: 92,
      solved: true
    },
    {
      id: 5,
      title: 'Valid Parentheses',
      difficulty: 'EASY',
      tags: ['String', 'Stack'],
      acceptanceRate: 81,
      solved: false
    },
    {
      id: 6,
      title: 'Merge Two Sorted Lists',
      difficulty: 'EASY',
      tags: ['Linked List', 'Recursion'],
      acceptanceRate: 75,
      solved: true
    },
    {
      id: 7,
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'EASY',
      tags: ['Array', 'Dynamic Programming'],
      acceptanceRate: 83,
      solved: false
    },
    {
      id: 8,
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'MEDIUM',
      tags: ['Hash Table', 'String', 'Sliding Window'],
      acceptanceRate: 62,
      solved: false
    },
    {
      id: 9,
      title: 'Add Two Numbers',
      difficulty: 'MEDIUM',
      tags: ['Linked List', 'Math', 'Recursion'],
      acceptanceRate: 71,
      solved: false
    },
    {
      id: 10,
      title: 'Container With Most Water',
      difficulty: 'MEDIUM',
      tags: ['Array', 'Two Pointers', 'Greedy'],
      acceptanceRate: 58,
      solved: true
    },
    {
      id: 11,
      title: 'Regular Expression Matching',
      difficulty: 'HARD',
      tags: ['String', 'Dynamic Programming', 'Recursion'],
      acceptanceRate: 41,
      solved: false
    },
    {
      id: 12,
      title: 'Median of Two Sorted Arrays',
      difficulty: 'HARD',
      tags: ['Array', 'Binary Search', 'Divide and Conquer'],
      acceptanceRate: 36,
      solved: false
    }
  ];

  constructor(
    private problemService: ProblemService,
    private problemStateService: ProblemStateService
  ) {}

  ngOnInit() {
    this.loadProblems();
    
    // Subscribe to problem state changes for real-time updates
    this.subscriptions.add(
      this.problemStateService.problemSolved$.subscribe(event => {
        if (event && event.problemId > 0 && event.solved) {
          // A problem was solved, refresh the list
          this.refreshProblems();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // Public method to refresh problems - can be called from other components
  refreshProblems() {
    this.loadProblems();
  }

  private loadProblems() {
    this.loading = true;
    
    this.problemService.getAllProblems().subscribe({
      next: (problems) => {
        this.problems = problems.map(p => ({
          ...p,
          acceptanceRate: p.acceptanceRate || 0,
          solved: p.solved || false
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading problems:', error);
        // Load mock data as fallback
        this.problems = this.mockProblems;
        this.applyFilters();
        this.loading = false;
      }
    });
  }
  
  // Apply filters to problems
  applyFilters() {
    // Start with all problems
    let result = [...this.problems];
    
    // Apply search filter
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      result = result.filter(problem => 
        problem.title.toLowerCase().includes(searchTermLower) || 
        problem.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }
    
    // Apply difficulty filter
    if (this.difficultyFilter !== 'ALL') {
      result = result.filter(problem => problem.difficulty === this.difficultyFilter);
    }
    
    // Apply status filter
    if (this.statusFilter === 'SOLVED') {
      result = result.filter(problem => problem.solved);
    } else if (this.statusFilter === 'UNSOLVED') {
      result = result.filter(problem => !problem.solved);
    }
    
    // Update filtered problems
    this.filteredProblems = result;
    this.currentPage = 0; // Reset to first page when filters change
  }
  
  // Handle pagination events
  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }
} 