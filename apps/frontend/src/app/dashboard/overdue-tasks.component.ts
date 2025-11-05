import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDto } from '@angular-nest-starter/shared-types';

@Component({
  selector: 'app-overdue-tasks',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overdue-tasks-section">
      <header class="section-header">
        <h2>
          <svg class="warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Overdue Tasks
          @if (tasks().length > 0) {
            <span class="overdue-count">{{ tasks().length }}</span>
          }
        </h2>
        <p class="section-subtitle">Tasks past their due date requiring attention</p>
      </header>

      @if (tasks().length === 0) {
        <div class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="22 4 12 14.01 9 11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="empty-message">All tasks are on schedule</p>
          <p class="empty-submessage">Great work! No overdue tasks at this time</p>
        </div>
      } @else {
        <div class="tasks-list">
          @for (task of tasks(); track task.id) {
            <div class="task-card">
              <div class="task-header">
                <h3 class="task-title">{{ task.title }}</h3>
                <span class="priority-badge" [class]="'priority-badge--' + task.priority.toLowerCase()">
                  {{ task.priority }}
                </span>
              </div>

              <div class="task-meta">
                <div class="task-overdue-badge">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="12 6 12 12 16 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="overdue-text">{{ calculateDaysOverdue(task.dueDate) }}</span>
                </div>

                @if (task.dueDate) {
                  <div class="task-due-date">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Due {{ formatDueDate(task.dueDate) }}</span>
                  </div>
                }

                @if (task.projectId) {
                  <div class="task-project">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <rect x="14" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <rect x="14" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <rect x="3" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Project</span>
                  </div>
                }

                @if (task.clientId) {
                  <div class="task-client">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="9" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Client</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div class="section-footer">
          <a href="#" class="view-all-link">View All Tasks →</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .overdue-tasks-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #d32f2f;
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.25rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .warning-icon {
      width: 24px;
      height: 24px;
      color: #d32f2f;
      flex-shrink: 0;
    }

    .overdue-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #d32f2f;
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
      min-width: 24px;
      height: 24px;
      padding: 0 0.5rem;
      border-radius: 12px;
      margin-left: 0.25rem;
    }

    .section-subtitle {
      font-size: 0.875rem;
      color: #666;
      margin: 0;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      text-align: center;
    }

    .empty-icon {
      width: 48px;
      height: 48px;
      color: #4caf50;
      margin-bottom: 1rem;
    }

    .empty-message {
      font-size: 1rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 0.25rem 0;
    }

    .empty-submessage {
      font-size: 0.875rem;
      color: #666;
      margin: 0;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .task-card {
      border: 2px solid #ffcdd2;
      border-left: 4px solid #d32f2f;
      border-radius: 8px;
      padding: 1rem;
      background: linear-gradient(to right, #ffebee 0%, white 50%);
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    }

    .task-card:hover {
      border-color: #d32f2f;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.15);
      transform: translateY(-1px);
    }

    .task-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .task-title {
      font-size: 1rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0;
      flex: 1;
      line-height: 1.4;
    }

    .priority-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: 12px;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .priority-badge--low {
      background: #e3f2fd;
      color: #1976d2;
    }

    .priority-badge--medium {
      background: #fff3e0;
      color: #f57c00;
    }

    .priority-badge--high {
      background: #ffe0b2;
      color: #e65100;
    }

    .priority-badge--urgent {
      background: #ffcdd2;
      color: #c62828;
    }

    .task-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 0.875rem;
      color: #666;
    }

    .task-overdue-badge {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      background: #d32f2f;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-weight: 600;
    }

    .overdue-text {
      font-size: 0.8125rem;
    }

    .task-due-date,
    .task-project,
    .task-client {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .section-footer {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
      text-align: center;
    }

    .view-all-link {
      color: #d32f2f;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      transition: color 0.2s;
    }

    .view-all-link:hover {
      color: #b71c1c;
      text-decoration: underline;
    }
  `],
})
export class OverdueTasksComponent {
  tasks = input.required<TaskDto[]>();

  calculateDaysOverdue(dueDate: Date | null): string {
    if (!dueDate) {
      return 'Overdue';
    }

    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return '1 day overdue';
    } else {
      return `${diffDays} days overdue`;
    }
  }

  formatDueDate(dueDate: Date | null): string {
    if (!dueDate) {
      return '';
    }

    const date = new Date(dueDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
