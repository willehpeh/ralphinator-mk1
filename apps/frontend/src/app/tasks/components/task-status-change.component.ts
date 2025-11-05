import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskStatus } from '@angular-nest-starter/shared-types';
import { TASK_STATUSES } from '../task.constants';

@Component({
  selector: 'app-task-status-change',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="status-change-form">
      <h3>Change Task Status</h3>

      <div class="form-group">
        <label for="status">New Status</label>
        <select
          id="status"
          name="status"
          [(ngModel)]="selectedStatus"
          class="form-control"
        >
          @for (status of statusOptions; track status) {
            <option [value]="status">
              {{ status }}
            </option>
          }
        </select>
      </div>

      @if (selectedStatus === currentStatus()) {
        <div class="warning-message">
          This is already the current status
        </div>
      }

      <div class="button-group">
        <button
          type="button"
          class="btn btn-secondary"
          (click)="onCancel()"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          (click)="onSubmit()"
          [disabled]="selectedStatus === currentStatus()"
        >
          Change Status
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .status-change-form {
        padding: 1.5rem;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #2c3e50;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #34495e;
        font-weight: 500;
        font-size: 0.875rem;
      }

      .form-control {
        width: 100%;
        padding: 0.625rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.875rem;
        transition: border-color 0.2s ease;
      }

      .form-control:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
      }

      .warning-message {
        padding: 0.75rem;
        background-color: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 4px;
        color: #856404;
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }

      .button-group {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
      }

      .btn {
        padding: 0.625rem 1.25rem;
        border: none;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-secondary {
        background-color: #95a5a6;
        color: white;
      }

      .btn-secondary:hover:not(:disabled) {
        background-color: #7f8c8d;
      }

      .btn-primary {
        background-color: #3498db;
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background-color: #2980b9;
      }
    `,
  ],
})
export class TaskStatusChangeComponent {
  currentStatus = input.required<TaskStatus>();
  statusChanged = output<TaskStatus>();
  cancelled = output<void>();

  statusOptions = TASK_STATUSES;
  selectedStatus: TaskStatus = 'Todo';

  constructor() {
    // Initialize selectedStatus when currentStatus changes
    effect(() => {
      this.selectedStatus = this.currentStatus();
    });
  }

  onSubmit(): void {
    if (this.selectedStatus !== this.currentStatus()) {
      this.statusChanged.emit(this.selectedStatus);
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
