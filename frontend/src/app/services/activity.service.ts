import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ActivityData {
  date: string; // YYYY-MM-DD format
  submissionCount: number;
  acceptedCount: number;
  totalProblems: number;
}

export interface ActivitySummary {
  totalSubmissions: number;
  totalAccepted: number;
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  /**
   * Get daily activity data for a specific month and year
   */
  getMonthlyActivity(year: number, month: number): Observable<ActivityData[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', (month + 1).toString()); // Convert 0-based month to 1-based
    
    return this.http.get<ActivityData[]>(`${this.apiUrl}/activity/monthly`, { params });
  }

  /**
   * Get activity data for a date range
   */
  getActivityRange(startDate: string, endDate: string): Observable<ActivityData[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<ActivityData[]>(`${this.apiUrl}/activity/range`, { params });
  }

  /**
   * Get activity summary for the current user
   */
  getActivitySummary(): Observable<ActivitySummary> {
    return this.http.get<ActivitySummary>(`${this.apiUrl}/activity/summary`);
  }

  /**
   * Get yearly activity overview
   */
  getYearlyActivity(year: number): Observable<ActivityData[]> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<ActivityData[]>(`${this.apiUrl}/activity/yearly`, { params });
  }
}
