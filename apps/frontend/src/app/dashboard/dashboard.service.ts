import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStatistics } from './dashboard.types';
import { TaskDto, CommunicationReadModel } from '@angular-nest-starter/shared-types';

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
  getUpcomingTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.apiUrl}/tasks/upcoming`);
  }

  /**
   * Get overdue tasks from the backend
   * Returns all incomplete tasks with due dates in the past, sorted by due date (oldest first)
   */
  getOverdueTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.apiUrl}/tasks/overdue`);
  }

  /**
   * Get recent communications from the backend
   * Returns last 10 communications sorted by date (newest first)
   */
  getRecentCommunications(): Observable<CommunicationReadModel[]> {
    return this.http.get<CommunicationReadModel[]>(`${this.apiUrl}/communications/recent`);
  }

  /**
   * Get follow-up communications from the backend
   * Returns communications requiring follow-up sorted by follow-up date (earliest first)
   */
  getFollowUpCommunications(): Observable<CommunicationReadModel[]> {
    return this.http.get<CommunicationReadModel[]>(`${this.apiUrl}/communications/followups`);
  }
}
