import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProblemService, Problem as BaseProblem } from '../../../services/problem.service';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

// Extend the base Problem interface with additional properties needed for this component
interface Problem extends BaseProblem {
  acceptanceRate?: number;
  solved?: boolean;
}

@Component({
  selector: 'app-problem-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-2">
          <button mat-icon-button color="primary" routerLink="/problems">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="text-2xl font-semibold">Problem Details</h1>
        </div>
        <button mat-button color="primary" routerLink="/dashboard">
          <mat-icon>dashboard</mat-icon> Back to Dashboard
        </button>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div *ngIf="loading" class="flex justify-center items-center p-16">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        
        <ng-container *ngIf="!loading && problem">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">{{ problem.title }}</h2>
              <div>
                <mat-chip [ngClass]="{
                  'bg-green-100 text-green-800': problem.difficulty === 'EASY',
                  'bg-yellow-100 text-yellow-800': problem.difficulty === 'MEDIUM',
                  'bg-red-100 text-red-800': problem.difficulty === 'HARD'
                }">
                  {{ problem.difficulty }}
                </mat-chip>
              </div>
            </div>
            
            <div class="mb-6">
              <mat-chip-set>
                <mat-chip *ngFor="let tag of problem.tags" class="bg-gray-100 text-sm">
                  {{ tag }}
                </mat-chip>
              </mat-chip-set>
            </div>
            
            <mat-divider class="mb-6"></mat-divider>
            
            <mat-tab-group>
              <mat-tab label="Description">
                <div class="p-4">
                  <div class="prose max-w-none">
                    <p>{{ problem.description }}</p>
                    
                    <h3 class="mt-6 text-lg font-medium">Constraints:</h3>
                    <pre class="bg-gray-50 p-3 rounded">{{ problem.constraints }}</pre>
                    
                    <h3 class="mt-6 text-lg font-medium">Input Format:</h3>
                    <pre class="bg-gray-50 p-3 rounded">{{ problem.inputFormat }}</pre>
                    
                    <h3 class="mt-6 text-lg font-medium">Output Format:</h3>
                    <pre class="bg-gray-50 p-3 rounded">{{ problem.outputFormat }}</pre>
                  </div>
                </div>
              </mat-tab>
              <mat-tab label="Solution">
                <div class="p-4 text-center">
                  <p class="text-gray-500">Solution editor coming soon...</p>
                </div>
              </mat-tab>
              <mat-tab label="Submissions">
                <div class="p-4 text-center">
                  <p class="text-gray-500">Your submissions will appear here...</p>
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>
        </ng-container>
        
        <div *ngIf="!loading && !problem" class="p-16 text-center">
          <mat-icon class="text-gray-400 text-6xl mb-4">error_outline</mat-icon>
          <p class="text-xl text-gray-600">Problem not found</p>
          <button mat-button color="primary" routerLink="/problems" class="mt-4">
            Back to Problems
          </button>
        </div>
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
    .prose p {
      margin-bottom: 1rem;
    }
    pre {
      white-space: pre-wrap;
    }
  `]
})
export class ProblemDetailComponent implements OnInit {
  problem: Problem | null = null;
  loading = true;
  
  // Mock problem data
  mockProblems: Problem[] = [
    {
      id: 1,
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
      difficulty: 'EASY',
      constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
      inputFormat: 'First line contains n - the size of the array\nSecond line contains n space-separated integers\nThird line contains the target sum',
      outputFormat: 'Two space-separated integers representing the indices',
      tags: ['Array', 'Hash Table'],
      acceptanceRate: 78,
      solved: true
    },
    {
      id: 2,
      title: 'Maximum Subarray',
      description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.',
      difficulty: 'MEDIUM',
      constraints: '-10^4 <= nums[i] <= 10^4\n1 <= nums.length <= 10^5',
      inputFormat: 'First line contains n - the length of array\nSecond line contains n space-separated integers',
      outputFormat: 'A single integer representing the maximum subarray sum',
      tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
      acceptanceRate: 65,
      solved: false
    },
    {
      id: 3,
      title: 'Binary Tree Maximum Path Sum',
      description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root. The path sum of a path is the sum of the node values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.',
      difficulty: 'HARD',
      constraints: 'The number of nodes in the tree is in the range [1, 3 * 10^4]\n-1000 <= Node.val <= 1000',
      inputFormat: 'The input represents a binary tree in level order traversal\nFirst line contains the number of nodes\nSecond line contains space-separated integers or null',
      outputFormat: 'A single integer representing the maximum path sum',
      tags: ['Binary Tree', 'DFS', 'Dynamic Programming'],
      acceptanceRate: 47,
      solved: false
    }
    // Add more mock problems as needed
  ];

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.loading = true;
        
        // Find the problem in our mock data
        const mockProblem = this.mockProblems.find(p => p.id === id);
        if (mockProblem) {
          return of(mockProblem);
        }
        
        // If not in mock data, try the API (commented out for now)
        // return this.problemService.getProblemById(id);
        return of(null);
      }),
      catchError(error => {
        console.error('Error loading problem:', error);
        return of(null);
      })
    ).subscribe(problem => {
      this.problem = problem;
      this.loading = false;
    });
  }
} 