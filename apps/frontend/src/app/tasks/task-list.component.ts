import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as TasksActions from './store/tasks.actions';
import { selectAllTasks, selectTasksLoading, selectTasksError, selectHasTasks } from './store/tasks.selectors';
import { selectAllClients } from '../clients/store/clients.selectors';
import * as ClientsActions from '../clients/store/clients.actions';
import { TASK_UI_TEXT } from './task-display.constants';
import { TaskStatus } from '@angular-nest-starter/shared-types';
import { formatDate, isOverdue, daysOverdue } from '../shared/date-utils';
import { formatTaskStatus } from './utils/task-display-utils';
import { extractSelectValue, extractInputValue, extractCheckboxValue } from '../shared/form-event-utils';
import { getPriorityBadgeClass, getStatusBadgeClass } from '../shared/badge-utils';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './task-list.component.scss',
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
        <div class="filter-group search-group">
          <label for="task-search" class="filter-label">Search:</label>
          <input
            id="task-search"
            type="text"
            class="search-input"
            placeholder="Search by title or notes..."
            [value]="searchQuery()"
            (input)="onSearchChange($event)">
        </div>

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

        <div class="filter-group">
          <label for="client-filter" class="filter-label">Filter by Client:</label>
          <select
            id="client-filter"
            class="filter-select"
            [value]="selectedClientId()"
            (change)="onClientFilterChange($event)">
            <option value="">All Clients</option>
            @for (client of clients(); track client.id) {
              <option [value]="client.id">{{ client.companyName }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label for="project-filter" class="filter-label">Filter by Project:</label>
          <select
            id="project-filter"
            class="filter-select"
            [value]="selectedProjectId()"
            (change)="onProjectFilterChange($event)">
            <option value="">All Projects</option>
            @for (projectId of uniqueProjectIds(); track projectId) {
              <option [value]="projectId">{{ projectId }}</option>
            }
          </select>
        </div>

        <div class="filter-group filter-checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              class="filter-checkbox"
              [checked]="showOverdueOnly()"
              (change)="onOverdueFilterChange($event)">
            <span class="checkbox-text">{{ TASK_UI_TEXT.SHOW_OVERDUE_ONLY }}</span>
          </label>
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
                    <span [ngClass]="['priority-badge', getPriorityClass(task.priority)]">
                      {{ task.priority }}
                    </span>
                    <span [ngClass]="['status-badge', getStatusClass(task.status)]">
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
                        <span class="overdue-indicator">
                          {{ daysOverdue(task.dueDate) === 1 ? 'overdue by 1 day' : 'overdue by ' + daysOverdue(task.dueDate) + ' days' }}
                        </span>
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
                    {{ TASK_UI_TEXT.VIEW_DETAILS }}
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            @if (showOverdueOnly()) {
              <h3>{{ TASK_UI_TEXT.NO_OVERDUE_TASKS }}</h3>
              <p>{{ TASK_UI_TEXT.NO_OVERDUE_TASKS_DESCRIPTION }}</p>
            } @else {
              <h3>{{ TASK_UI_TEXT.NO_TASKS_FOUND }}</h3>
              <p>{{ TASK_UI_TEXT.ADD_FIRST_TASK }}</p>
              <button type="button" class="add-first-task-button" (click)="onAddTask()">
                {{ TASK_UI_TEXT.ADD_NEW_TASK }}
              </button>
            }
          </div>
        }
      }
    </div>
  `
})
export class TaskListComponent implements OnInit {
  // Dependency injection using inject()
  private store = inject(Store);
  private router = inject(Router);

  // Constants for template
  readonly TASK_UI_TEXT = TASK_UI_TEXT;

  // Selectors using selectSignal
  tasks = this.store.selectSignal(selectAllTasks);
  loading = this.store.selectSignal(selectTasksLoading);
  error = this.store.selectSignal(selectTasksError);
  hasTasks = this.store.selectSignal(selectHasTasks);
  clients = this.store.selectSignal(selectAllClients);

  // Filter state using signals
  selectedPriority = signal<string>('');
  selectedStatus = signal<string>('');
  selectedClientId = signal<string>('');
  selectedProjectId = signal<string>('');
  showOverdueOnly = signal<boolean>(false);
  searchQuery = signal<string>('');

  // Computed unique project IDs from all tasks
  uniqueProjectIds = computed(() => {
    const allTasks = this.tasks();
    const projectIds = allTasks
      .map(task => task.projectId)
      .filter((id): id is string => id !== null && id !== undefined);
    return Array.from(new Set(projectIds)).sort();
  });

  // Computed filtered tasks
  filteredTasks = computed(() => {
    const allTasks = this.tasks();
    const priority = this.selectedPriority();
    const status = this.selectedStatus();
    const clientId = this.selectedClientId();
    const projectId = this.selectedProjectId();
    const overdueOnly = this.showOverdueOnly();
    const search = this.searchQuery().toLowerCase().trim();

    let filtered = allTasks;

    if (priority) {
      filtered = filtered.filter(task => task.priority === priority);
    }

    if (status) {
      filtered = filtered.filter(task => task.status === status);
    }

    if (clientId) {
      filtered = filtered.filter(task => task.clientId === clientId);
    }

    if (projectId) {
      filtered = filtered.filter(task => task.projectId === projectId);
    }

    if (overdueOnly) {
      filtered = filtered.filter(task =>
        this.isOverdue(task.dueDate) &&
        task.status !== 'Completed' &&
        task.status !== 'Cancelled'
      );
    }

    if (search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        (task.notes && task.notes.toLowerCase().includes(search))
      );
    }

    // Sort overdue tasks by days overdue (most urgent first)
    if (overdueOnly) {
      filtered = filtered.sort((a, b) => {
        const daysOverdueA = this.daysOverdue(a.dueDate);
        const daysOverdueB = this.daysOverdue(b.dueDate);
        return daysOverdueB - daysOverdueA; // Descending order (most overdue first)
      });
    }

    return filtered;
  });

  ngOnInit(): void {
    // Dispatch action to load all tasks when component initializes
    this.store.dispatch(TasksActions.loadTasks());
    // Dispatch action to load all clients for the filter dropdown
    this.store.dispatch(ClientsActions.loadClients());
  }

  onPriorityFilterChange(event: Event): void {
    this.selectedPriority.set(extractSelectValue(event));
  }

  onStatusFilterChange(event: Event): void {
    this.selectedStatus.set(extractSelectValue(event));
  }

  onClientFilterChange(event: Event): void {
    this.selectedClientId.set(extractSelectValue(event));
  }

  onProjectFilterChange(event: Event): void {
    this.selectedProjectId.set(extractSelectValue(event));
  }

  onOverdueFilterChange(event: Event): void {
    this.showOverdueOnly.set(extractCheckboxValue(event));
  }

  onSearchChange(event: Event): void {
    this.searchQuery.set(extractInputValue(event));
  }

  onAddTask(): void {
    this.router.navigate(['/tasks/add']);
  }

  onViewTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  onRetry(): void {
    this.store.dispatch(TasksActions.loadTasks());
  }

  formatStatus(status: TaskStatus): string {
    return formatTaskStatus(status);
  }

  formatDate(date: Date | null): string {
    return formatDate(date);
  }

  isOverdue(dueDate: Date | null): boolean {
    return isOverdue(dueDate);
  }

  daysOverdue(dueDate: Date | null): number {
    return daysOverdue(dueDate);
  }

  getPriorityClass(priority: string): string {
    return getPriorityBadgeClass(priority);
  }

  getStatusClass(status: string): string {
    return getStatusBadgeClass(status);
  }
}
