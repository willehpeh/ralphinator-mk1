import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStatistics } from './dashboard.types';

/**
 * Service for dashboard-related API calls
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/dashboard';

  /**
   * Get dashboard statistics from the backend
   * Returns counts of active clients, projects, pending tasks, and follow-ups required
   */
  getDashboardStatistics(): Observable<DashboardStatistics> {
    return this.http.get<DashboardStatistics>(`${this.apiUrl}/statistics`);
  }
}
