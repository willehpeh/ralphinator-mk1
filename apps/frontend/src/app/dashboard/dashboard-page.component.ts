import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadDashboardStatistics, loadUpcomingTasks, loadOverdueTasks, loadRecentCommunications } from './store/dashboard.actions';
import {
  selectDashboardStatistics,
  selectDashboardLoading,
  selectDashboardError,
  selectHasStatistics,
  selectUpcomingTasks,
  selectOverdueTasks,
  selectRecentCommunications,
} from './store/dashboard.selectors';
import { UpcomingTasksComponent } from './upcoming-tasks.component';
import { OverdueTasksComponent } from './overdue-tasks.component';
import { RecentCommunicationsComponent } from './recent-communications.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, UpcomingTasksComponent, OverdueTasksComponent, RecentCommunicationsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <p class="subtitle">Your current workload at a glance</p>
      </header>

      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading statistics...</p>
        </div>
      } @else if (error()) {
        <div class="error-state">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/>
          </svg>
          <h2>Failed to Load Statistics</h2>
          <p>{{ error() }}</p>
          <button class="retry-button" (click)="loadStatistics()">Retry</button>
        </div>
      } @else if (hasStatistics()) {
        <div class="statistics-grid">
          <div class="stat-card stat-card--clients">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics()?.activeClientsCount ?? 0 }}</div>
              <div class="stat-label">Active Clients</div>
            </div>
          </div>

          <div class="stat-card stat-card--projects">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="14" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="14" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="3" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics()?.activeProjectsCount ?? 0 }}</div>
              <div class="stat-label">Active Projects</div>
            </div>
          </div>

          <div class="stat-card stat-card--tasks">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 11l3 3L22 4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics()?.pendingTasksCount ?? 0 }}</div>
              <div class="stat-label">Pending Tasks</div>
            </div>
          </div>

          <div class="stat-card stat-card--followups">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics()?.followUpsRequiredCount ?? 0 }}</div>
              <div class="stat-label">Follow-ups Required</div>
            </div>
          </div>
        </div>
      } @else {
        <div class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="14" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="14" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="3" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h2>No Data Yet</h2>
          <p>Start by adding your first clients, projects, and tasks to see your dashboard statistics.</p>
        </div>
      }

      <div class="tasks-sections">
        <div class="overdue-tasks-container">
          <app-overdue-tasks [tasks]="overdueTasks()" />
        </div>

        <div class="upcoming-tasks-container">
          <app-upcoming-tasks [tasks]="upcomingTasks()" />
        </div>
      </div>

      <div class="communications-section">
        <app-recent-communications [communications]="recentCommunications()" />
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      font-size: 1rem;
      color: #666;
      margin: 0;
    }

    .statistics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon svg {
      width: 24px;
      height: 24px;
    }

    .stat-card--clients .stat-icon {
      background: #e3f2fd;
      color: #1976d2;
    }

    .stat-card--projects .stat-icon {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .stat-card--tasks .stat-icon {
      background: #e8f5e9;
      color: #388e3c;
    }

    .stat-card--followups .stat-icon {
      background: #fff3e0;
      color: #f57c00;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
      margin-top: 0.25rem;
      font-weight: 500;
    }

    .loading-state,
    .error-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #1976d2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-state p {
      color: #666;
      font-size: 1rem;
    }

    .error-icon,
    .empty-icon {
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
    }

    .error-icon {
      color: #d32f2f;
    }

    .empty-icon {
      color: #bdbdbd;
    }

    .error-state h2,
    .empty-state h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.5rem 0;
    }

    .error-state p,
    .empty-state p {
      color: #666;
      font-size: 1rem;
      margin: 0 0 1.5rem 0;
      max-width: 500px;
    }

    .retry-button {
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .retry-button:hover {
      background: #1565c0;
    }

    .retry-button:active {
      transform: scale(0.98);
    }

    .tasks-sections {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .overdue-tasks-container {
      width: 100%;
    }

    .upcoming-tasks-container {
      width: 100%;
    }

    .communications-section {
      margin-top: 2rem;
      width: 100%;
    }
  `],
})
export class DashboardPageComponent implements OnInit {
  private store = inject(Store);

  // Store selectors as signals
  statistics = this.store.selectSignal(selectDashboardStatistics);
  loading = this.store.selectSignal(selectDashboardLoading);
  error = this.store.selectSignal(selectDashboardError);
  hasStatistics = this.store.selectSignal(selectHasStatistics);
  upcomingTasks = this.store.selectSignal(selectUpcomingTasks);
  overdueTasks = this.store.selectSignal(selectOverdueTasks);
  recentCommunications = this.store.selectSignal(selectRecentCommunications);

  ngOnInit(): void {
    this.loadStatistics();
    this.loadUpcomingTasks();
    this.loadOverdueTasks();
    this.loadRecentCommunications();
  }

  loadStatistics(): void {
    this.store.dispatch(loadDashboardStatistics());
  }

  loadUpcomingTasks(): void {
    this.store.dispatch(loadUpcomingTasks());
  }

  loadOverdueTasks(): void {
    this.store.dispatch(loadOverdueTasks());
  }

  loadRecentCommunications(): void {
    this.store.dispatch(loadRecentCommunications());
  }
}
