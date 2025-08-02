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
  image?: string; // For visual examples
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
    console.log('ProblemDetailComponent initialized');
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
    console.log('Loading problem with ID:', problemId);
    this.problemService.getProblemById(+problemId).subscribe({
      next: (data) => {
        console.log('Problem loaded:', data);
        this.problem = data;
        this.processExamples();
        console.log('Examples processed:', this.examples);
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
      // Filter for sample test cases (isSample = true) to show as examples
      const sampleTestCases = this.problem.testCases.filter((testCase) => testCase.isSample);
      
      if (sampleTestCases.length > 0) {
        this.examples = sampleTestCases.map((testCase, index) => ({
          input: testCase.input,
          output: testCase.expectedOutput,
          explanation: this.generateExplanation(testCase, index + 1)
        }));
      } else {
        // If no sample test cases, show first few test cases as examples
        this.examples = this.problem.testCases.slice(0, 2).map((testCase, index) => ({
          input: testCase.input,
          output: testCase.expectedOutput,
          explanation: this.generateExplanation(testCase, index + 1)
        }));
      }
    } else {
      // No test cases available
      this.examples = [];
    }
  }

  private generateExplanation(testCase: any, exampleNumber: number): string {
    // Generate detailed explanations based on problem type
    if (this.problem?.title?.toLowerCase().includes('two sum')) {
      return `We can see that nums[0] + nums[1] = ${testCase.input.split(',')[0]} + ${testCase.input.split(',')[1]} = target.`;
    } else if (this.problem?.title?.toLowerCase().includes('palindrome')) {
      return `The string reads the same forward and backward.`;
    } else if (this.problem?.title?.toLowerCase().includes('reverse')) {
      return `We reverse the order of elements in the input.`;
    }
    return `The algorithm processes the input to produce the expected output.`;
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
      this.executionResult = {
        status: 'ERROR',
        error: 'Please write some code before submitting.'
      };
      return;
    }

    console.log('Submitting solution:', {
      problemId: this.problem.id,
      code: this.code,
      language: this.selectedLanguage
    });

    this.isRunning = true;
    this.executionResult = null;

    this.problemService.submitSolution(this.problem.id, this.code, this.selectedLanguage).subscribe({
      next: (result) => {
        console.log('Submission successful:', result);
        this.executionResult = result;
        this.isRunning = false;
      },
      error: (err) => {
        console.error('Submission failed:', err);
        this.executionResult = {
          status: 'ERROR',
          error: 'Failed to submit solution. Please try again.'
        };
        this.isRunning = false;
      }
    });
  }

  onRun() {
    console.log('Run button clicked');
    
    if (!this.problem || !this.code.trim()) {
      this.executionResult = {
        status: 'ERROR',
        error: 'Please write some code before running.'
      };
      return;
    }

    this.isRunning = true;
    this.executionResult = null;
    this.error = null;

    this.executionService.executeCode(this.problem.id, this.code, this.selectedLanguage)
      .subscribe({
        next: (result) => {
          console.log('Execution successful:', result);
          this.executionResult = result;
          this.isRunning = false;
        },
        error: (err) => {
          console.error('Code execution failed:', err);
          this.executionResult = {
            status: 'ERROR',
            error: `Failed to execute code: ${err.message || 'Please try again.'}`
          };
          this.isRunning = false;
        }
      });
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  hasFollowUp(): boolean {
    // Check if the problem type typically has follow-up questions
    const title = this.problem?.title?.toLowerCase() || '';
    return title.includes('two sum') || 
           title.includes('reverse') || 
           title.includes('palindrome') ||
           title.includes('merge') ||
           title.includes('binary');
  }

  getFollowUpText(): string {
    const title = this.problem?.title?.toLowerCase() || '';
    
    if (title.includes('two sum')) {
      return 'Can you come up with an algorithm that is less than O(n²) time complexity?';
    } else if (title.includes('reverse')) {
      return 'Can you solve this without converting the integer to a string?';
    } else if (title.includes('palindrome')) {
      return 'Could you solve it without converting the string to lowercase and removing non-alphanumeric characters?';
    } else if (title.includes('merge')) {
      return 'Can you solve this in O(1) extra space complexity?';
    } else if (title.includes('binary')) {
      return 'Can you solve this using the binary search approach?';
    }
    
    return 'Can you solve this with better time or space complexity?';
  }
} 