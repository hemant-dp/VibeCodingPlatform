import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ExecutionResult {
  status: string;
  output?: string;
  error?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  executionTimeMs?: number;
  memoryUsedKb?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  executeCode(problemId: number, code: string, language: string): Observable<ExecutionResult> {
    const url = `${this.apiUrl}/api/execute`;
    const body = {
      problemId,
      code,
      language
    };
    
    // Temporarily disable authorization - no auth headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    console.log('Making API call to:', url);
    console.log('Request body:', body);
    console.log('Headers (no auth):', headers);
    
    return this.http.post<ExecutionResult>(url, body, { headers });
  }
} 