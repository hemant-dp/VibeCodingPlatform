import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Problem {
  id: number;
  title: string;
  description?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  constraints?: string;
  inputFormat?: string;
  outputFormat?: string;
  tags: string[];
  createdAt?: string;
  testCases?: TestCase[];
}

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private apiUrl = `${environment.apiUrl}/problems`;

  constructor(private http: HttpClient) {}

  getAllProblems(): Observable<Problem[]> {
    return this.http.get<Problem[]>(this.apiUrl);
  }

  getRecentProblems(limit: number = 5): Observable<Problem[]> {
    return this.http.get<Problem[]>(`${this.apiUrl}/recent`, {
      params: { limit: limit.toString() }
    });
  }

  getProblemById(id: number): Observable<Problem> {
    return this.http.get<Problem>(`${this.apiUrl}/${id}`);
  }

  submitSolution(problemId: number, code: string, language: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${problemId}/submit`, { code, language });
  }
} 