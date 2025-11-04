import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as TasksActions from './store/tasks.actions';
import { selectAllTasks, selectTasksLoading, selectTasksError, selectHasTasks } from './store/tasks.selectors';
import { TASK_UI_TEXT } from './task-display.constants';
import { TaskPriority, TaskStatus } from '@angular-nest-starter/shared-types';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="task-list-container">
      <div class="task-list-header">
        <h1>{{ TASK_UI_TEXT.TASK_LIST }}</h1>
        <button type="button" class="add-task-button" (click)="onAddTask()">
          {{ TASK_UI_TEXT.ADD_NEW_TASK }}
        </button>
      </div>

      <!-- Filter Controls -->
      <div class="filter-controls">
        <div class="filter-group">
          <label for="priority-filter" class="filter-label">Filter by Priority:</label>
          <select
            id="priority-filter"
            class="filter-select"
            [value]="selectedPriority()"
            (change)="onPriorityFilterChange($event)">
            <option value="">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="status-filter" class="filter-label">Filter by Status:</label>
          <select
            id="status-filter"
            class="filter-select"
            [value]="selectedStatus()"
            (change)="onStatusFilterChange($event)">
            <option value="">All Statuses</option>
            <option value="Todo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <p>{{ TASK_UI_TEXT.LOADING_TASKS }}</p>
        </div>
      }

      @if (error(); as errorMessage) {
        <div class="error-state">
          <p>{{ errorMessage }}</p>
          <button type="button" (click)="onRetry()">Retry</button>
        </div>
      }

      @if (!loading() && !error()) {
        @if (filteredTasks().length > 0) {
          <div class="task-list">
            @for (task of filteredTasks(); track task.id) {
              <div class="task-card">
                <div class="task-header">
                  <h3 class="task-title">{{ task.title }}</h3>
                  <div class="task-badges">
                    <span
                      class="priority-badge"
                      [class.priority-urgent]="task.priority === 'Urgent'"
                      [class.priority-high]="task.priority === 'High'"
                      [class.priority-medium]="task.priority === 'Medium'"
                      [class.priority-low]="task.priority === 'Low'">
                      {{ task.priority }}
                    </span>
                    <span
                      class="status-badge"
                      [class.status-todo]="task.status === 'Todo'"
                      [class.status-in-progress]="task.status === 'InProgress'"
                      [class.status-completed]="task.status === 'Completed'"
                      [class.status-cancelled]="task.status === 'Cancelled'">
                      {{ formatStatus(task.status) }}
                    </span>
                  </div>
                </div>

                @if (task.notes) {
                  <p class="task-notes">{{ task.notes }}</p>
                }

                <div class="task-metadata">
                  @if (task.dueDate) {
                    <div class="metadata-item" [class.overdue]="isOverdue(task.dueDate)">
                      <span class="metadata-label">{{ TASK_UI_TEXT.LABEL_DUE_DATE }}</span>
                      <span class="metadata-value">{{ formatDate(task.dueDate) }}</span>
                      @if (isOverdue(task.dueDate)) {
                        <span class="overdue-indicator">OVERDUE</span>
                      }
                    </div>
                  }

                  @if (task.clientId) {
                    <div class="metadata-item">
                      <span class="metadata-label">{{ TASK_UI_TEXT.LABEL_CLIENT }}</span>
                      <span class="metadata-value">{{ task.clientId }}</span>
                    </div>
                  }

                  @if (task.projectId) {
                    <div class="metadata-item">
                      <span class="metadata-label">{{ TASK_UI_TEXT.LABEL_PROJECT }}</span>
                      <span class="metadata-value">{{ task.projectId }}</span>
                    </div>
                  }
                </div>

                <div class="task-actions">
                  <button type="button" class="action-button" (click)="onViewTask(task.id)">
                    View Details
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <h3>{{ TASK_UI_TEXT.NO_TASKS_FOUND }}</h3>
            <p>{{ TASK_UI_TEXT.ADD_FIRST_TASK }}</p>
            <button type="button" class="add-first-task-button" (click)="onAddTask()">
              {{ TASK_UI_TEXT.ADD_NEW_TASK }}
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .task-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .task-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      color: #2c3e50;
      font-size: 2rem;
    }

    .add-task-button {
      padding: 0.75rem 1.5rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .add-task-button:hover {
      background-color: #2980b9;
    }

    .filter-controls {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .filter-label {
      font-size: 0.95rem;
      font-weight: 600;
      color: #2c3e50;
      white-space: nowrap;
    }

    .filter-select {
      padding: 0.5rem 1rem;
      border: 1px solid #d5dbdb;
      border-radius: 4px;
      background-color: white;
      color: #2c3e50;
      font-size: 0.95rem;
      cursor: pointer;
      transition: border-color 0.2s;
      min-width: 180px;
    }

    .filter-select:hover {
      border-color: #3498db;
    }

    .filter-select:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
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

    .task-list {
      display: grid;
      gap: 1.5rem;
    }

    .task-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.2s;
    }

    .task-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .task-title {
      margin: 0;
      color: #2c3e50;
      font-size: 1.25rem;
      flex: 1;
    }

    .task-badges {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .priority-badge,
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .priority-badge {
      color: white;
    }

    .priority-urgent {
      background-color: #e74c3c;
    }

    .priority-high {
      background-color: #e67e22;
    }

    .priority-medium {
      background-color: #f39c12;
    }

    .priority-low {
      background-color: #95a5a6;
    }

    .status-badge {
      color: white;
    }

    .status-todo {
      background-color: #95a5a6;
    }

    .status-in-progress {
      background-color: #3498db;
    }

    .status-completed {
      background-color: #27ae60;
    }

    .status-cancelled {
      background-color: #7f8c8d;
    }

    .task-notes {
      color: #7f8c8d;
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }

    .task-metadata {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #ecf0f1;
    }

    .metadata-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .metadata-item.overdue {
      color: #e74c3c;
    }

    .metadata-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #95a5a6;
      letter-spacing: 0.5px;
    }

    .metadata-value {
      font-size: 0.95rem;
      color: #2c3e50;
      font-weight: 500;
    }

    .overdue-indicator {
      font-size: 0.7rem;
      font-weight: 700;
      color: #e74c3c;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 0.25rem;
    }

    .task-actions {
      display: flex;
      gap: 0.5rem;
      padding-top: 1rem;
      border-top: 1px solid #ecf0f1;
    }

    .action-button {
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

    .action-button:hover {
      background-color: #d5dbdb;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1.5rem;
    }

    .empty-state p {
      margin: 0 0 1.5rem 0;
      color: #7f8c8d;
      font-size: 1rem;
    }

    .add-first-task-button {
      padding: 0.75rem 1.5rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .add-first-task-button:hover {
      background-color: #2980b9;
    }

    @media (max-width: 768px) {
      .task-list-container {
        padding: 1rem;
      }

      .task-list-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .task-header {
        flex-direction: column;
      }

      .task-badges {
        justify-content: flex-start;
      }

      .task-metadata {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  // Dependency injection using inject()
  private store = inject(Store);

  // Constants for template
  readonly TASK_UI_TEXT = TASK_UI_TEXT;

  // Selectors using selectSignal
  tasks = this.store.selectSignal(selectAllTasks);
  loading = this.store.selectSignal(selectTasksLoading);
  error = this.store.selectSignal(selectTasksError);
  hasTasks = this.store.selectSignal(selectHasTasks);

  // Filter state using signals
  selectedPriority = signal<string>('');
  selectedStatus = signal<string>('');

  // Computed filtered tasks
  filteredTasks = computed(() => {
    const allTasks = this.tasks();
    const priority = this.selectedPriority();
    const status = this.selectedStatus();

    let filtered = allTasks;

    if (priority) {
      filtered = filtered.filter(task => task.priority === priority);
    }

    if (status) {
      filtered = filtered.filter(task => task.status === status);
    }

    return filtered;
  });

  ngOnInit(): void {
    // Dispatch action to load all tasks when component initializes
    this.store.dispatch(TasksActions.loadTasks());
  }

  onPriorityFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPriority.set(selectElement.value);
  }

  onStatusFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStatus.set(selectElement.value);
  }

  onAddTask(): void {
    // TODO: Navigate to add task page
    console.log('Navigate to add task page');
  }

  onViewTask(taskId: string): void {
    // TODO: Navigate to task detail page
    console.log('View task:', taskId);
  }

  onRetry(): void {
    this.store.dispatch(TasksActions.loadTasks());
  }

  formatStatus(status: TaskStatus): string {
    return status.replace(/_/g, ' ');
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  isOverdue(dueDate: Date | null): boolean {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }
}
