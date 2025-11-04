import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectTaskById, selectTasksLoading, selectTasksError } from './store/tasks.selectors';
import * as TasksActions from './store/tasks.actions';
import { TaskStatusChangeComponent } from './components/task-status-change.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';
import { TaskStatus } from '@angular-nest-starter/shared-types';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, RouterModule, TaskStatusChangeComponent, ConfirmationDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="task-detail-container">
      <div class="task-detail-header">
        <button type="button" class="back-button" (click)="onBack()">
          ← Back to Tasks
        </button>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <p>Loading task details...</p>
        </div>
      }

      @if (error(); as errorMessage) {
        <div class="error-state">
          <p>{{ errorMessage }}</p>
          <button type="button" (click)="onRetry()">Retry</button>
        </div>
      }

      @if (!loading() && !error()) {
        @if (task(); as taskData) {
          <!-- Overdue Warning Banner -->
          @if (isOverdue()) {
            <div class="overdue-banner">
              <span class="warning-icon">⚠️</span>
              <span>This task is overdue by {{ overdueByText() }}</span>
            </div>
          }

          <div class="task-detail-card">
            <!-- Title and Badges -->
            <div class="title-section">
              <h1 class="task-title">{{ taskData.title }}</h1>
              <div class="badges">
                <span class="badge status-badge status-{{ taskData.status.toLowerCase() }}">
                  {{ taskData.status }}
                </span>
                <span class="badge priority-badge priority-{{ taskData.priority.toLowerCase() }}">
                  {{ taskData.priority }}
                </span>
              </div>
            </div>

            <!-- Notes Section -->
            @if (taskData.notes) {
              <div class="detail-section">
                <h3 class="section-title">Description</h3>
                <p class="notes">{{ taskData.notes }}</p>
              </div>
            }

            <!-- Metadata Grid -->
            <div class="metadata-grid">
              <!-- Deadline -->
              <div class="metadata-item">
                <span class="metadata-label">Deadline</span>
                <span class="metadata-value" [class.overdue-text]="isOverdue()">
                  {{ deadlineText() }}
                </span>
              </div>

              <!-- Client -->
              <div class="metadata-item">
                <span class="metadata-label">Client</span>
                @if (taskData.clientId) {
                  <a [routerLink]="['/clients', taskData.clientId]" class="metadata-link">
                    View Client →
                  </a>
                } @else {
                  <span class="metadata-value no-value">No client assigned</span>
                }
              </div>

              <!-- Project -->
              <div class="metadata-item">
                <span class="metadata-label">Project</span>
                @if (taskData.projectId) {
                  <a [routerLink]="['/projects', taskData.projectId]" class="metadata-link">
                    View Project →
                  </a>
                } @else {
                  <span class="metadata-value no-value">No project assigned</span>
                }
              </div>

              <!-- Created At -->
              <div class="metadata-item">
                <span class="metadata-label">Created</span>
                <span class="metadata-value">
                  {{ taskData.createdAt | date:'medium' }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="actions-section">
              <button type="button" class="action-button primary" (click)="onEdit()">
                Edit Task
              </button>
              <button type="button" class="action-button success" (click)="onComplete()">
                Mark Complete
              </button>
              <button type="button" class="action-button secondary" (click)="onChangeStatus()">
                Change Status
              </button>
              <button type="button" class="action-button danger" (click)="onDelete()">
                Delete Task
              </button>
            </div>
          </div>

          <!-- Status Change Component -->
          @if (showStatusChange()) {
            <div class="status-change-overlay">
              <div class="status-change-modal">
                <app-task-status-change
                  [currentStatus]="taskData.status"
                  (statusChanged)="onStatusChanged($event)"
                  (cancelled)="onStatusChangeCancelled()"
                />
              </div>
            </div>
          }

          <!-- Delete Confirmation Dialog -->
          @if (showDeleteConfirmation()) {
            <app-confirmation-dialog
              [title]="'Delete Task'"
              [message]="'Are you sure you want to delete this task? This action cannot be undone.'"
              [confirmText]="'Delete'"
              [cancelText]="'Cancel'"
              (confirmed)="onDeleteConfirmed()"
              (cancelled)="onDeleteCancelled()"
            />
          }
        } @else {
          <div class="error-state">
            <p>Task not found</p>
            <button type="button" (click)="onBack()">Back to Tasks</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .task-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .task-detail-header {
      margin-bottom: 2rem;
    }

    .back-button {
      padding: 0.5rem 1rem;
      background-color: #ecf0f1;
      color: #2c3e50;
      border: none;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .back-button:hover {
      background-color: #d5dbdb;
    }

    .loading-state,
    .error-state {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .error-state button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .error-state button:hover {
      background-color: #c0392b;
    }

    .overdue-banner {
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #856404;
      font-weight: 500;
    }

    .warning-icon {
      font-size: 1.5rem;
    }

    .task-detail-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .title-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #ecf0f1;
    }

    .task-title {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      font-size: 2rem;
      font-weight: 600;
      line-height: 1.3;
    }

    .badges {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .badge {
      padding: 0.375rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    /* Status Badge Colors */
    .status-badge.status-todo {
      background-color: #3498db;
      color: white;
    }

    .status-badge.status-inprogress {
      background-color: #f39c12;
      color: white;
    }

    .status-badge.status-completed {
      background-color: #27ae60;
      color: white;
    }

    .status-badge.status-cancelled {
      background-color: #95a5a6;
      color: white;
    }

    /* Priority Badge Colors */
    .priority-badge.priority-low {
      background-color: #95a5a6;
      color: white;
    }

    .priority-badge.priority-medium {
      background-color: #3498db;
      color: white;
    }

    .priority-badge.priority-high {
      background-color: #e67e22;
      color: white;
    }

    .priority-badge.priority-urgent {
      background-color: #e74c3c;
      color: white;
    }

    .detail-section {
      margin-bottom: 2rem;
    }

    .section-title {
      color: #2c3e50;
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 0.75rem 0;
    }

    .notes {
      color: #34495e;
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
    }

    .metadata-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metadata-item {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .metadata-label {
      font-size: 0.875rem;
      color: #7f8c8d;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metadata-value {
      color: #2c3e50;
      font-size: 1rem;
      font-weight: 500;
    }

    .metadata-value.no-value {
      color: #95a5a6;
      font-style: italic;
    }

    .metadata-value.overdue-text {
      color: #e74c3c;
      font-weight: 600;
    }

    .metadata-link {
      color: #3498db;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .metadata-link:hover {
      color: #2980b9;
      text-decoration: underline;
    }

    .actions-section {
      display: flex;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid #ecf0f1;
      flex-wrap: wrap;
    }

    .action-button {
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 4px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-button.primary {
      background-color: #3498db;
      color: white;
    }

    .action-button.primary:hover {
      background-color: #2980b9;
    }

    .action-button.success {
      background-color: #27ae60;
      color: white;
    }

    .action-button.success:hover {
      background-color: #229954;
    }

    .action-button.secondary {
      background-color: #95a5a6;
      color: white;
    }

    .action-button.secondary:hover {
      background-color: #7f8c8d;
    }

    .action-button.danger {
      background-color: #e74c3c;
      color: white;
    }

    .action-button.danger:hover {
      background-color: #c0392b;
    }

    .status-change-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .status-change-modal {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-width: 500px;
      width: 90%;
    }

    @media (max-width: 768px) {
      .task-detail-container {
        padding: 1rem;
      }

      .task-detail-card {
        padding: 1.5rem;
      }

      .task-title {
        font-size: 1.5rem;
      }

      .metadata-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .actions-section {
        flex-direction: column;
      }

      .action-button {
        width: 100%;
      }

      .status-change-modal {
        width: 95%;
        max-width: none;
      }
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Task ID from route parameter
  taskId = signal<string>('');

  // Task data from store
  task = this.store.selectSignal(selectTaskById(this.taskId()));
  loading = this.store.selectSignal(selectTasksLoading);
  error = this.store.selectSignal(selectTasksError);

  // Status change UI visibility
  showStatusChange = signal(false);

  // Delete confirmation UI visibility
  showDeleteConfirmation = signal(false);

  // Computed values for deadline and overdue status
  isOverdue = computed(() => {
    const taskData = this.task();
    if (!taskData || !taskData.dueDate) return false;
    const now = new Date();
    const deadline = new Date(taskData.dueDate);
    return deadline < now && taskData.status !== 'Completed';
  });

  overdueByText = computed(() => {
    const taskData = this.task();
    if (!taskData || !taskData.dueDate) return '';
    const now = new Date();
    const deadline = new Date(taskData.dueDate);
    const diffMs = now.getTime() - deadline.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'less than a day';
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  });

  deadlineText = computed(() => {
    const taskData = this.task();
    if (!taskData || !taskData.dueDate) return 'No deadline set';

    const now = new Date();
    const deadline = new Date(taskData.dueDate);
    const diffMs = deadline.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return deadline.toLocaleDateString();
    }
  });

  ngOnInit(): void {
    // Get task ID from route parameter
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.taskId.set(id);
        // Dispatch action to load all tasks if not already loaded
        this.store.dispatch(TasksActions.loadTasks());
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/tasks']);
  }

  onRetry(): void {
    this.store.dispatch(TasksActions.loadTasks());
  }

  onEdit(): void {
    const id = this.taskId();
    if (id) {
      this.router.navigate(['/tasks', id, 'edit']);
    }
  }

  onComplete(): void {
    const id = this.taskId();
    if (id) {
      this.store.dispatch(
        TasksActions.changeTaskStatus({ id, status: 'Completed' })
      );
    }
  }

  onChangeStatus(): void {
    this.showStatusChange.set(true);
  }

  onStatusChanged(newStatus: TaskStatus): void {
    const id = this.taskId();
    if (id) {
      this.store.dispatch(
        TasksActions.changeTaskStatus({ id, status: newStatus })
      );
      this.showStatusChange.set(false);
    }
  }

  onStatusChangeCancelled(): void {
    this.showStatusChange.set(false);
  }

  onDelete(): void {
    this.showDeleteConfirmation.set(true);
  }

  onDeleteConfirmed(): void {
    const id = this.taskId();
    if (id) {
      this.store.dispatch(TasksActions.deleteTask({ id }));
      this.showDeleteConfirmation.set(false);
      // Navigate back to the task list after deletion
      this.router.navigate(['/tasks']);
    }
  }

  onDeleteCancelled(): void {
    this.showDeleteConfirmation.set(false);
  }
}
