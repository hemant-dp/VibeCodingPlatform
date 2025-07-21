import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { SubmissionService, Submission } from '../../../services/submission.service';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-submission-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-2">
          <button mat-icon-button color="primary" routerLink="/submissions">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="text-2xl font-semibold">Submission Details</h1>
        </div>
        <button mat-button color="primary" routerLink="/dashboard">
          <mat-icon>dashboard</mat-icon> Back to Dashboard
        </button>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div *ngIf="loading" class="flex justify-center items-center p-16">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        
        <ng-container *ngIf="!loading && submission">
          <div class="p-6">
            <div class="flex flex-col md:flex-row justify-between mb-6">
              <div>
                <h2 class="text-xl font-medium">
                  <a [routerLink]="['/problems', submission.problemId]" class="text-[#0033A1] hover:underline">
                    {{ submission.problem?.title }}
                  </a>
                </h2>
                <p class="text-gray-500">Submitted on {{ submission.submittedAt | date:'medium' }}</p>
              </div>
              <div class="mt-4 md:mt-0">
                <mat-chip [ngClass]="getStatusClass(submission.status)" class="mr-2">
                  {{ submission.status }}
                </mat-chip>
                <mat-chip class="bg-gray-100">
                  {{ submission.language }}
                </mat-chip>
              </div>
            </div>
            
            <mat-divider class="mb-6"></mat-divider>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="p-4 bg-gray-50 rounded">
                <p class="text-sm text-gray-500 mb-1">Runtime</p>
                <p class="text-lg font-semibold">{{ submission.executionTimeMs ?? '-' }} ms</p>
              </div>
              <div class="p-4 bg-gray-50 rounded">
                <p class="text-sm text-gray-500 mb-1">Memory</p>
                <p class="text-lg font-semibold">{{ submission.memoryUsedKb ? (submission.memoryUsedKb / 1024).toFixed(2) + ' MB' : '-' }}</p>
              </div>
            </div>
            
            <mat-tab-group>
              <mat-tab label="Code">
                <div class="p-4">
                  <pre class="bg-gray-50 p-4 rounded overflow-x-auto">{{ submission.code }}</pre>
                </div>
              </mat-tab>
              <mat-tab label="Output">
                <div class="p-4">
                  <ng-container *ngIf="submission.compileOutput">
                    <h3 class="text-lg font-medium mb-2">Compilation Output</h3>
                    <pre class="bg-red-50 text-red-800 p-4 rounded mb-4">{{ submission.compileOutput }}</pre>
                  </ng-container>
                  
                  <ng-container *ngIf="submission.judgeOutput">
                    <h3 class="text-lg font-medium mb-2">Execution Output</h3>
                    <pre class="bg-gray-50 p-4 rounded">{{ submission.judgeOutput }}</pre>
                  </ng-container>
                  
                  <div *ngIf="!submission.compileOutput && !submission.judgeOutput" class="text-center py-8 text-gray-500">
                    <p>No output available</p>
                  </div>
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>
        </ng-container>
        
        <div *ngIf="!loading && !submission" class="p-16 text-center">
          <mat-icon class="text-gray-400 text-6xl mb-4">error_outline</mat-icon>
          <p class="text-xl text-gray-600">Submission not found</p>
          <button mat-button color="primary" routerLink="/submissions" class="mt-4">
            Back to Submissions
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
    pre {
      white-space: pre-wrap;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    }
  `]
})
export class SubmissionDetailComponent implements OnInit {
  submission: Submission | null = null;
  loading = true;
  
  // Mock submissions data
  mockSubmissions: Submission[] = [
    {
      id: 1,
      problemId: 1,
      userId: 101,
      code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        throw new IllegalArgumentException("No two sum solution");
    }
}`,
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
      code: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        max_sum = current_sum = nums[0]
        for num in nums[1:]:
            current_sum = max(num, current_sum + num)
            max_sum = max(max_sum, current_sum)
        return max_sum`,
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
      code: `class Solution {
    private int maxSum;
    
    public int maxPathSum(TreeNode root) {
        maxSum = Integer.MIN_VALUE;
        calculateMaxPath(root);
        return maxSum;
    }
    
    private int calculateMaxPath(TreeNode node) {
        if (node == null) return 0;
        
        // Error: not handling negative values correctly
        int leftSum = calculateMaxPath(node.left);
        int rightSum = calculateMaxPath(node.right);
        
        maxSum = Math.max(maxSum, node.val + leftSum + rightSum);
        
        return node.val + Math.max(leftSum, rightSum);
    }
}`,
      language: 'JAVA',
      status: 'WRONG_ANSWER',
      executionTimeMs: 8,
      memoryUsedKb: 41984,
      judgeOutput: "Expected: 42\nActual: 35\nFailed on test case: [-10, 9, 20, null, null, 15, 7]",
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
      code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        vector<int> result;
        for (int i = 0; i < nums.size(); i++) {
            for (int j = i + 1; j < nums.size(); j++) {
                if (nums[i] + nums[j] == target) {
                    result.push_back(i);
                    result.push_back(j);
                    return result;
                }
            }
        }
        return result;
    }
};`,
      language: 'CPP',
      status: 'TIME_LIMIT_EXCEEDED',
      executionTimeMs: 500,
      memoryUsedKb: 20480,
      judgeOutput: "Time Limit Exceeded\nYour solution took longer than the allowed time limit.",
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
      code: `class Solution:
    def maxArea(self, height: List[int]) -> int:
        max_area = 0
        for i in range(len(height)):
            for j in range(i + 1 len(height)):  # SyntaxError: missing comma
                h = min(height[i], height[j])
                w = j - i
                max_area = max(max_area, h * w)
        return max_area`,
      language: 'PYTHON',
      status: 'COMPILATION_ERROR',
      compileOutput: "SyntaxError: invalid syntax (Solution.py, line 4)\nj in range(i + 1 len(height)): ^\n",
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

  constructor(
    private route: ActivatedRoute,
    private submissionService: SubmissionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.loading = true;
        
        // Find the submission in our mock data
        const mockSubmission = this.mockSubmissions.find(s => s.id === id);
        if (mockSubmission) {
          return of(mockSubmission);
        }
        
        // If not in mock data, try the API (commented out for now)
        // return this.submissionService.getSubmission(id);
        return of(null);
      }),
      catchError(error => {
        console.error('Error loading submission:', error);
        return of(null);
      })
    ).subscribe(submission => {
      this.submission = submission;
      this.loading = false;
    });
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
}
