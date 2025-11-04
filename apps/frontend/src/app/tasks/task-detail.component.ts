import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectTaskById, selectTasksLoading, selectTasksError } from './store/tasks.selectors';
import * as TasksActions from './store/tasks.actions';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, RouterModule],
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
          <div class="task-detail-card">
            <h1 class="task-title">{{ taskData.title }}</h1>
            <p>Task ID: {{ taskData.id }}</p>
          </div>
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

    .task-detail-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .task-title {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      font-size: 2rem;
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
}
