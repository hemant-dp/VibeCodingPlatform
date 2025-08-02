import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserStats {
  score: number;
  problemsSolved: number;
  totalSubmissions: number;
  acceptanceRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  async getCurrentUser(): Promise<UserProfile> {
    const response = await firstValueFrom(this.http.get<UserProfile>(`${this.apiUrl}/me`));
    if (!response) {
      throw new Error('User not found');
    }
    return response;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await firstValueFrom(this.http.get<UserStats>(`${this.apiUrl}/me/stats`));
    if (!response) {
      throw new Error('User stats not found');
    }
    return response;
  }
} 