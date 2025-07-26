import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProblemService, Problem, TestCase } from '../../../services/problem.service';

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
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
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

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService
  ) {}

  ngOnInit() {
    this.loadProblem();
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
        .filter((testCase: TestCase) => testCase.isSample)
        .map((testCase: TestCase) => ({
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
  }

  onSubmit() {
    if (!this.problem || !this.code.trim()) {
      console.warn('Cannot submit: missing problem or code');
      return;
    }

    console.log('Submitting solution for problem:', this.problem.id);
    
    this.problemService.submitSolution(this.problem.id, this.code, this.selectedLanguage).subscribe({
      next: (result) => {
        console.log('Submission successful:', result);
        // TODO: Handle successful submission (show result, navigate to submissions, etc.)
      },
      error: (err) => {
        console.error('Submission failed:', err);
        // TODO: Handle submission error
      }
    });
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }
} 