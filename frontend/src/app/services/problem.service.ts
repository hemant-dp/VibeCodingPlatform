import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  constraints?: string;
  inputFormat?: string;
  outputFormat?: string;
  tags: string[];
  testCases: TestCase[];
  createdAt?: Date;
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

  constructor(private http: HttpClient) { }

  getProblems(): Observable<Problem[]> {
    return this.http.get<Problem[]>(this.apiUrl);
  }

  getProblem(id: number): Observable<Problem> {
    return this.http.get<Problem>(`${this.apiUrl}/${id}`);
  }

  createProblem(problem: Partial<Problem>): Observable<Problem> {
    return this.http.post<Problem>(this.apiUrl, problem);
  }

  updateProblem(id: number, problem: Partial<Problem>): Observable<Problem> {
    return this.http.put<Problem>(`${this.apiUrl}/${id}`, problem);
  }

  deleteProblem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRecentProblems(limit: number = 5): Observable<Problem[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Problem[]>(`${this.apiUrl}/recent`, { params });
  }
} 