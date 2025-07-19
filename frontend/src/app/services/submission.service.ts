import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Submission {
  id: number;
  problemId: number;
  userId: number;
  code: string;
  language: 'JAVA' | 'PYTHON' | 'CPP';
  status: 'PENDING' | 'COMPILING' | 'RUNNING' | 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR';
  executionTimeMs?: number;
  memoryUsedKb?: number;
  submittedAt: Date;
  judgeOutput?: string;
  compileOutput?: string;
  problem?: {
    id: number;
    title: string;
    difficulty: string;
  };
  user?: {
    id: number;
    username: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = `${environment.apiUrl}/submissions`;

  constructor(private http: HttpClient) { }

  getSubmissions(problemId?: number): Observable<Submission[]> {
    const url = problemId ? `${this.apiUrl}?problemId=${problemId}` : this.apiUrl;
    return this.http.get<Submission[]>(url);
  }

  getSubmission(id: number): Observable<Submission> {
    return this.http.get<Submission>(`${this.apiUrl}/${id}`);
  }

  submit(submission: { problemId: number; code: string; language: string }): Observable<Submission> {
    return this.http.post<Submission>(this.apiUrl, submission);
  }

  getUserSubmissions(): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.apiUrl}/my-submissions`);
  }

  getRecentSubmissions(limit: number = 5): Observable<Submission[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Submission[]>(`${this.apiUrl}/recent`, { params });
  }
} 