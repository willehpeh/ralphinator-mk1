import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskDto } from '@angular-nest-starter/shared-types';

@Component({
  selector: 'app-upcoming-tasks',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="upcoming-tasks-section">
      <header class="section-header">
        <h2>Upcoming Tasks</h2>
        <p class="section-subtitle">Next 10 tasks by due date</p>
      </header>

      @if (tasks().length === 0) {
        <div class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 11l3 3L22 4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="empty-message">No upcoming tasks</p>
          <p class="empty-submessage">Add your first task to get started</p>
          <a routerLink="/tasks" class="empty-action-btn">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Add Task
          </a>
        </div>
      } @else {
        <div class="tasks-list">
          @for (task of tasks(); track task.id) {
            <div class="task-card" [class.task-card--overdue]="isOverdue(task)">
              <div class="task-header">
                <h3 class="task-title">{{ task.title }}</h3>
                <span class="priority-badge" [class]="'priority-badge--' + task.priority.toLowerCase()">
                  {{ task.priority }}
                </span>
              </div>

              <div class="task-meta">
                @if (task.dueDate) {
                  <div class="task-due-date" [class.overdue]="isOverdue(task)">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ formatDueDate(task.dueDate) }}</span>
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
    .upcoming-tasks-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.25rem 0;
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
      color: #bdbdbd;
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
      margin: 0 0 1.5rem 0;
    }

    .empty-action-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #1976d2;
      color: white;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 8px;
      transition: background-color 0.2s, box-shadow 0.2s;
    }

    .empty-action-btn:hover {
      background: #1565c0;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    }

    .empty-action-btn .btn-icon {
      width: 18px;
      height: 18px;
      stroke-width: 2.5;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .task-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .task-card:hover {
      border-color: #1976d2;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
    }

    .task-card--overdue {
      border-left: 4px solid #d32f2f;
      background: #ffebee;
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

    .task-due-date,
    .task-project,
    .task-client {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .task-due-date.overdue {
      color: #d32f2f;
      font-weight: 500;
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
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      transition: color 0.2s;
    }

    .view-all-link:hover {
      color: #1565c0;
      text-decoration: underline;
    }
  `],
})
export class UpcomingTasksComponent {
  tasks = input.required<TaskDto[]>();

  isOverdue(task: TaskDto): boolean {
    if (!task.dueDate) {
      return false;
    }
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  }

  formatDueDate(dueDate: Date | null): string {
    if (!dueDate) {
      return '';
    }

    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return `${overdueDays} day${overdueDays === 1 ? '' : 's'} overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }
}
