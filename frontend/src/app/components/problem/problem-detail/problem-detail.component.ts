import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    MatFormFieldModule
  ]
})
export class ProblemDetailComponent implements OnInit {
  problem = {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    constraints: [
      'Each input would have exactly one solution',
      'You may not use the same element twice'
    ],
    topics: ['Array', 'Hash Table'],
    companies: ['Cognizant', 'Other Top Companies']
  };

  selectedLanguage = 'C++';
  code = '';
  selectedTabIndex = 0;

  constructor() {}

  ngOnInit() {}

  onLanguageChange(language: string) {
    this.selectedLanguage = language;
  }

  onSubmit() {
    console.log('Submitting solution:', this.code);
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }
} 