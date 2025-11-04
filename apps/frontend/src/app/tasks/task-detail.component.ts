import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectTaskById, selectTasksLoading, selectTasksError } from './store/tasks.selectors';
import * as TasksActions from './store/tasks.actions';
import { TaskStatusChangeComponent } from './components/task-status-change.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';
import { TaskStatus } from '@angular-nest-starter/shared-types';
import { formatOverdueText, formatDeadlineText, isOverdue as isTaskOverdue } from '../shared/date-utils';
import { TASK_UI_TEXT } from './task-display.constants';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, RouterModule, TaskStatusChangeComponent, ConfirmationDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './task-detail.component.scss',
  template: `
    <div class="task-detail-container">
      <div class="task-detail-header">
        <button type="button" class="back-button" (click)="onBack()">
          {{ UI_TEXT.BACK_TO_TASKS }}
        </button>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <p>{{ UI_TEXT.LOADING_TASK_DETAILS }}</p>
        </div>
      }

      @if (error(); as errorMessage) {
        <div class="error-state">
          <p>{{ errorMessage }}</p>
          <button type="button" (click)="onRetry()">{{ UI_TEXT.RETRY }}</button>
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
                <h3 class="section-title">{{ UI_TEXT.LABEL_DESCRIPTION }}</h3>
                <p class="notes">{{ taskData.notes }}</p>
              </div>
            }

            <!-- Metadata Grid -->
            <div class="metadata-grid">
              <!-- Deadline -->
              <div class="metadata-item">
                <span class="metadata-label">{{ UI_TEXT.LABEL_DEADLINE }}</span>
                <span class="metadata-value" [class.overdue-text]="isOverdue()">
                  {{ deadlineText() }}
                </span>
              </div>

              <!-- Client -->
              <div class="metadata-item">
                <span class="metadata-label">{{ UI_TEXT.LABEL_CLIENT }}</span>
                @if (taskData.clientId) {
                  <a [routerLink]="['/clients', taskData.clientId]" class="metadata-link">
                    {{ UI_TEXT.VIEW_CLIENT }}
                  </a>
                } @else {
                  <span class="metadata-value no-value">{{ UI_TEXT.NO_CLIENT_ASSIGNED }}</span>
                }
              </div>

              <!-- Project -->
              <div class="metadata-item">
                <span class="metadata-label">{{ UI_TEXT.LABEL_PROJECT }}</span>
                @if (taskData.projectId) {
                  <a [routerLink]="['/projects', taskData.projectId]" class="metadata-link">
                    {{ UI_TEXT.VIEW_PROJECT }}
                  </a>
                } @else {
                  <span class="metadata-value no-value">{{ UI_TEXT.NO_PROJECT_ASSIGNED }}</span>
                }
              </div>

              <!-- Created At -->
              <div class="metadata-item">
                <span class="metadata-label">{{ UI_TEXT.LABEL_CREATED }}</span>
                <span class="metadata-value">
                  {{ taskData.createdAt | date:'medium' }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="actions-section">
              <button type="button" class="action-button primary" (click)="onEdit()">
                {{ UI_TEXT.EDIT_TASK }}
              </button>
              <button type="button" class="action-button success" (click)="onComplete()">
                {{ UI_TEXT.MARK_COMPLETE }}
              </button>
              <button type="button" class="action-button secondary" (click)="onChangeStatus()">
                {{ UI_TEXT.CHANGE_STATUS }}
              </button>
              <button type="button" class="action-button danger" (click)="onDelete()">
                {{ UI_TEXT.DELETE_TASK }}
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
              [title]="UI_TEXT.DELETE_CONFIRMATION_TITLE"
              [message]="UI_TEXT.DELETE_CONFIRMATION_MESSAGE"
              [confirmText]="UI_TEXT.DELETE_CONFIRM_BUTTON"
              [cancelText]="UI_TEXT.DELETE_CANCEL_BUTTON"
              (confirmed)="onDeleteConfirmed()"
              (cancelled)="onDeleteCancelled()"
            />
          }
        } @else {
          <div class="error-state">
            <p>{{ UI_TEXT.TASK_NOT_FOUND }}</p>
            <button type="button" (click)="onBack()">{{ UI_TEXT.BACK_TO_TASKS }}</button>
          </div>
        }
      }
    </div>
  `
})
export class TaskDetailComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Constants for UI text
  protected readonly UI_TEXT = TASK_UI_TEXT;

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
    const isCompleted = taskData.status === 'Completed';
    return isTaskOverdue(taskData.dueDate, isCompleted);
  });

  overdueByText = computed(() => {
    const taskData = this.task();
    if (!taskData || !taskData.dueDate) return '';
    return formatOverdueText(taskData.dueDate);
  });

  deadlineText = computed(() => {
    const taskData = this.task();
    return formatDeadlineText(taskData?.dueDate ?? null);
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
