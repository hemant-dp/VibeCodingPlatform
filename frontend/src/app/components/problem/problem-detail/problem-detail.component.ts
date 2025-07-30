import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';

import { ProblemService, Problem } from '../../../services/problem.service';
import { ExecutionService, ExecutionResult } from '../../../services/execution.service';

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatOptionModule
  ],
  providers: [
    ProblemService,
    ExecutionService
  ]
})
export class ProblemDetailComponent implements OnInit {
  problem: Problem | null = null;
  examples: Example[] = [];
  loading = true;
  error: string | null = null;
  selectedLanguage = 'C++';
  code = '';
  selectedTabIndex = 0;
  lineCount = 5;
  isRunning = false;
  executionResult: ExecutionResult | null = null;
  private currentProblemId: number = 0;

  getLineNumbers(): number[] {
    const lines = this.code.split('\n').length;
    const totalLines = Math.max(lines, this.lineCount);
    return Array.from({ length: totalLines }, (_, i) => i + 1);
  }

  onCodeChange(code: string) {
    this.code = code;
    this.lineCount = Math.max(code.split('\n').length, 5);
  }

  private languageTemplates: { [key: string]: string } = {
    'C++': `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
    'Java': `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
    'Python': `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        
`
  };

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private executionService: ExecutionService
  ) {}

  ngOnInit() {
    this.loadProblem();
    this.setLanguageTemplate(this.selectedLanguage);
  }

  loadProblem() {
    const problemId = this.route.snapshot.params['id'];
    if (!problemId) {
      this.error = 'Problem ID not found';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.problemService.getProblemById(+problemId).subscribe({
      next: (data) => {
        this.problem = data;
        this.processExamples();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading problem:', err);
        this.error = 'Failed to load problem details';
        this.loading = false;
      }
    });
  }

  private processExamples() {
    if (this.problem?.testCases) {
      this.examples = this.problem.testCases
        .filter((testCase) => testCase.isSample)
        .map((testCase) => ({
          input: testCase.input,
          output: testCase.expectedOutput,
          explanation: '' // You can add explanation logic here if needed
        }));
    }
  }

  getDifficultyDisplayValue(): string {
    if (!this.problem) return '';
    
    switch (this.problem.difficulty) {
      case 'EASY': return 'Easy';
      case 'MEDIUM': return 'Medium';
      case 'HARD': return 'Hard';
      default: return this.problem.difficulty;
    }
  }

  onLanguageChange(language: string) {
    this.selectedLanguage = language;
    this.setLanguageTemplate(language);
  }

  private setLanguageTemplate(language: string) {
    this.code = this.languageTemplates[language] || '';
  }

  onSubmit() {
    console.log('Submit button clicked');
    if (!this.problem || !this.code.trim()) {
      console.warn('Cannot submit: missing problem or code');
      this.error = 'Please write some code before submitting.';
      return;
    }

    console.log('Submitting solution:', {
      problemId: this.problem.id,
      code: this.code,
      language: this.selectedLanguage
    });

    this.isRunning = true;
    this.error = null;
    this.executionResult = null;

    this.problemService.submitSolution(this.problem.id, this.code, this.selectedLanguage).subscribe({
      next: (result) => {
        console.log('Submission successful:', result);
        this.executionResult = result;
        this.isRunning = false;
      },
      error: (err) => {
        console.error('Submission failed:', err);
        this.error = 'Failed to submit solution. Please try again.';
        this.isRunning = false;
      }
    });
  }

  onRun() {
    console.log('Run button clicked');
    if (!this.problem || !this.code.trim()) {
      this.error = 'Please write some code before running.';
      return;
    }

    console.log('Running code:', {
      problemId: this.problem.id,
      code: this.code,
      language: this.selectedLanguage
    });

    this.isRunning = true;
    this.error = null;
    this.executionResult = null;

    this.executionService.executeCode(this.problem.id, this.code, this.selectedLanguage)
      .subscribe({
        next: (result) => {
          console.log('Execution successful:', result);
          this.executionResult = result;
          if (result.status !== 'SUCCESS') {
            this.error = result.error || `Execution failed: ${result.status}`;
          }
          this.isRunning = false;
        },
        error: (err) => {
          console.error('Code execution failed:', err);
          this.error = 'Failed to execute code. Please try again.';
          this.isRunning = false;
        }
      });
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }
} 