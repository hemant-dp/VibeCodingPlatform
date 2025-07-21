import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProblemService } from '../../../services/problem.service';

interface Problem {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  acceptanceRate: number;
  solved: boolean;
}

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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h1 class="text-2xl font-semibold mb-6">Problem List</h1>
          
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="problems" class="w-full">
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
                    <mat-chip *ngFor="let tag of problem.tags" class="bg-gray-100 text-sm">
                      {{ tag }}
                    </mat-chip>
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
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- Loading Spinner -->
            <div *ngIf="loading" class="flex justify-center items-center p-8">
              <mat-spinner diameter="40"></mat-spinner>
            </div>

            <!-- No Problems Message -->
            <div *ngIf="!loading && problems.length === 0" class="text-center py-8 text-gray-500">
              No problems found
            </div>
          </div>
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
export class ProblemListComponent implements OnInit {
  problems: Problem[] = [];
  loading = true;
  displayedColumns = ['status', 'title', 'difficulty', 'tags', 'acceptanceRate'];

  constructor(private problemService: ProblemService) {}

  ngOnInit() {
    this.loadProblems();
  }

  private loadProblems() {
    this.loading = true;
    this.problemService.getAllProblems().subscribe({
      next: (problems) => {
        this.problems = problems.map(p => ({
          ...p,
          acceptanceRate: 0, // This should be calculated from submissions
          solved: false // This should be determined by user's submissions
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading problems:', error);
        this.loading = false;
      }
    });
  }
} 