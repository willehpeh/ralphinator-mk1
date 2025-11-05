import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStatistics } from './dashboard.types';
import { TaskReadModel } from '@angular-nest-starter/shared-types';

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

  /**
   * Get upcoming tasks from the backend
   * Returns next 10 incomplete tasks sorted by due date (earliest first)
   */
  getUpcomingTasks(): Observable<TaskReadModel[]> {
    return this.http.get<TaskReadModel[]>(`${this.apiUrl}/tasks/upcoming`);
  }

  /**
   * Get overdue tasks from the backend
   * Returns all incomplete tasks with due dates in the past, sorted by due date (oldest first)
   */
  getOverdueTasks(): Observable<TaskReadModel[]> {
    return this.http.get<TaskReadModel[]>(`${this.apiUrl}/tasks/overdue`);
  }
}
