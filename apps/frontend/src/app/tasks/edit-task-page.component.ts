import { Component, ChangeDetectionStrategy, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { UpdateTaskInput } from './task.types';
import { updateTask } from './store/tasks.actions';
import { selectTaskById, selectTasksError, selectTasksLoading } from './store/tasks.selectors';
import { TASK_STATUSES, TASK_PRIORITIES } from './task.constants';
import { TASK_FORM_LABELS, TASK_UI_TEXT } from './task-display.constants';
import { FormState } from '../shared/form-state';
import { ValidationErrorComponent } from '../shared/validation-error.component';
import { TaskStatus, TaskPriority } from '@angular-nest-starter/shared-types';
import { SUCCESS_MESSAGE_DISMISS_DURATION_MS } from '../shared/ui.constants';

interface TaskEditFormFields {
  title: FormControl<string>;
  notes: FormControl<string>;
  status: FormControl<TaskStatus>;
  priority: FormControl<TaskPriority>;
  dueDate: FormControl<string>;
  clientId: FormControl<string>;
  projectId: FormControl<string>;
}

/**
 * Container component for editing an existing task
 * Connects form to NGRX store and handles navigation
 */
@Component({
  selector: 'app-edit-task-page',
  imports: [CommonModule, ReactiveFormsModule, ValidationErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="edit-task-page">
      <div class="page-header">
        <button class="back-button" (click)="navigateToTaskDetail()">
          ← Back to Task Details
        </button>
        <h2>{{ TASK_UI_TEXT.EDIT_TASK_TITLE }}</h2>
      </div>

      @if (loading()) {
        <div class="loading-message">
          Loading task details...
        </div>
      }

      @if (loadError()) {
        <div class="error-message">
          {{ loadError() }}
        </div>
      }

      @if (!loading() && task()) {
        <div class="task-form">
          @if (formState.successMessage()) {
            <div class="success-message">
              {{ TASK_UI_TEXT.TASK_UPDATED_SUCCESS }}
            </div>
          }

          @if (formState.error()) {
            <div class="error-message">
              {{ formState.error() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="title">{{ TASK_FORM_LABELS.TITLE }}</label>
              <input
                id="title"
                type="text"
                formControlName="title"
                [placeholder]="TASK_FORM_LABELS.TITLE_PLACEHOLDER"
                [class.invalid]="form.controls.title.invalid && form.controls.title.touched"
              />
              <app-validation-error
                [control]="form.controls.title"
                [requiredMessage]="TASK_FORM_LABELS.TITLE_REQUIRED" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="status">{{ TASK_FORM_LABELS.STATUS }}</label>
                <select id="status" formControlName="status">
                  @for (status of availableStatuses; track status) {
                    <option [value]="status">{{ status }}</option>
                  }
                </select>
                <app-validation-error
                  [control]="form.controls.status"
                  [requiredMessage]="TASK_FORM_LABELS.STATUS_REQUIRED" />
              </div>

              <div class="form-group">
                <label for="priority">{{ TASK_FORM_LABELS.PRIORITY }}</label>
                <select id="priority" formControlName="priority">
                  @for (priority of availablePriorities; track priority) {
                    <option [value]="priority">{{ priority }}</option>
                  }
                </select>
                <app-validation-error
                  [control]="form.controls.priority"
                  [requiredMessage]="TASK_FORM_LABELS.PRIORITY_REQUIRED" />
              </div>
            </div>

            <div class="form-group">
              <label for="dueDate">{{ TASK_FORM_LABELS.DUE_DATE }}</label>
              <input
                id="dueDate"
                type="date"
                formControlName="dueDate"
                [class.invalid]="form.controls.dueDate.invalid && form.controls.dueDate.touched"
              />
            </div>

            <div class="form-group">
              <label for="notes">{{ TASK_FORM_LABELS.NOTES }}</label>
              <textarea
                id="notes"
                formControlName="notes"
                [placeholder]="TASK_FORM_LABELS.NOTES_PLACEHOLDER"
                rows="4"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="clientId">{{ TASK_FORM_LABELS.CLIENT_ID }}</label>
                <input
                  id="clientId"
                  type="text"
                  formControlName="clientId"
                  [placeholder]="TASK_FORM_LABELS.CLIENT_ID_PLACEHOLDER"
                />
              </div>

              <div class="form-group">
                <label for="projectId">{{ TASK_FORM_LABELS.PROJECT_ID }}</label>
                <input
                  id="projectId"
                  type="text"
                  formControlName="projectId"
                  [placeholder]="TASK_FORM_LABELS.PROJECT_ID_PLACEHOLDER"
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" [disabled]="form.invalid || formState.isSubmitting()">
                @if (formState.isSubmitting()) {
                  {{ TASK_FORM_LABELS.UPDATING_BUTTON }}
                } @else {
                  {{ TASK_FORM_LABELS.UPDATE_TASK_BUTTON }}
                }
              </button>
              <button type="button" (click)="onCancel()" [disabled]="formState.isSubmitting()">
                {{ TASK_FORM_LABELS.CANCEL_BUTTON }}
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .edit-task-page {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    .page-header h2 {
      margin: 0.5rem 0 0 0;
      color: #2c3e50;
      font-size: 1.5rem;
    }

    .back-button {
      background: none;
      border: none;
      color: #3498db;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.5rem 0;
      transition: color 0.2s;
    }

    .back-button:hover {
      color: #2980b9;
      text-decoration: underline;
    }

    .loading-message {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      color: #7f8c8d;
    }

    .task-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .success-message {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
    }

    .error-message {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .edit-task-page {
        padding: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #34495e;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: #3498db;
    }

    input.invalid,
    select.invalid,
    textarea.invalid {
      border-color: #d32f2f;
    }

    textarea {
      resize: vertical;
      font-family: inherit;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s, opacity 0.2s;
    }

    button[type="submit"] {
      background-color: #3498db;
      color: white;
    }

    button[type="submit"]:hover:not(:disabled) {
      background-color: #2980b9;
    }

    button[type="button"] {
      background-color: #95a5a6;
      color: white;
    }

    button[type="button"]:hover:not(:disabled) {
      background-color: #7f8c8d;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class EditTaskPageComponent {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Constants for template
  readonly TASK_FORM_LABELS = TASK_FORM_LABELS;
  readonly TASK_UI_TEXT = TASK_UI_TEXT;

  // Available options
  readonly availableStatuses = TASK_STATUSES;
  readonly availablePriorities = TASK_PRIORITIES;

  // Get task ID from route params
  private taskId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') || '')
    ),
    { initialValue: '' }
  );

  // Select state from store
  task = this.store.selectSignal(selectTaskById(this.taskId()));
  loading = this.store.selectSignal(selectTasksLoading);
  private error = this.store.selectSignal(selectTasksError);

  // Compute load error message
  loadError = computed(() => {
    const taskData = this.task();
    const errorMessage = this.error();
    const taskIdValue = this.taskId();

    if (!taskIdValue) {
      return 'No task ID provided';
    }
    if (errorMessage) {
      return errorMessage;
    }
    if (!this.loading() && !taskData) {
      return 'Task not found';
    }
    return null;
  });

  form = new FormGroup<TaskEditFormFields>({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true }),
    status: new FormControl<TaskStatus>('Todo', { nonNullable: true, validators: [Validators.required] }),
    priority: new FormControl<TaskPriority>('Medium', { nonNullable: true, validators: [Validators.required] }),
    dueDate: new FormControl('', { nonNullable: true }),
    clientId: new FormControl('', { nonNullable: true }),
    projectId: new FormControl('', { nonNullable: true })
  });

  formState = new FormState();

  constructor() {
    // Pre-populate form when task loads
    effect(() => {
      const taskData = this.task();
      if (taskData) {
        this.populateForm();
      }
    });

    // React to loading state changes
    effect(() => {
      this.formState.setSubmitting(this.loading());
    });

    // React to error state changes
    effect(() => {
      const errorMessage = this.error();
      if (errorMessage) {
        this.formState.setError(errorMessage);
      }
    });

    // React to successful task update
    effect(() => {
      const taskData = this.task();
      const loadingState = this.loading();
      const errorMessage = this.error();

      // If we were loading and now we're not, and there's no error, it was successful
      if (taskData && !loadingState && !errorMessage) {
        // Check if we just finished a submission (form is dirty)
        if (this.form.dirty && !this.form.pristine) {
          this.formState.setSuccess('Task updated successfully!', SUCCESS_MESSAGE_DISMISS_DURATION_MS);

          // Navigate back to task detail page after a brief delay
          setTimeout(() => {
            this.navigateToTaskDetail();
          }, SUCCESS_MESSAGE_DISMISS_DURATION_MS);
        }
      }
    });
  }

  /**
   * Populate form with task data
   */
  private populateForm(): void {
    const taskData = this.task();
    if (!taskData) return;

    this.form.patchValue({
      title: taskData.title,
      notes: taskData.notes || '',
      status: taskData.status,
      priority: taskData.priority,
      dueDate: taskData.dueDate ? this.formatDateForInput(taskData.dueDate) : '',
      clientId: taskData.clientId || '',
      projectId: taskData.projectId || ''
    });
  }

  /**
   * Format Date object to YYYY-MM-DD string for input[type="date"]
   */
  private formatDateForInput(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Handle task form submission
   * Dispatches updateTask action to NGRX store
   */
  onSubmit(): void {
    if (this.form.valid && !this.formState.isSubmitting()) {
      const taskIdValue = this.taskId();
      if (!taskIdValue) {
        this.formState.setError('No task ID available');
        return;
      }

      this.formState.clearMessages();
      const formValue = this.form.getRawValue();

      const taskInput: UpdateTaskInput = {
        title: formValue.title,
        status: formValue.status,
        priority: formValue.priority,
        notes: formValue.notes || null,
        dueDate: formValue.dueDate || null,
        clientId: formValue.clientId || null,
        projectId: formValue.projectId || null
      };

      this.store.dispatch(updateTask({ id: taskIdValue, task: taskInput }));
    }
  }

  /**
   * Handle form cancellation
   * Navigates back to task detail
   */
  onCancel(): void {
    this.navigateToTaskDetail();
  }

  /**
   * Navigate to the task detail page
   */
  navigateToTaskDetail(): void {
    const taskIdValue = this.taskId();
    if (taskIdValue) {
      this.router.navigate(['/tasks', taskIdValue]);
    } else {
      this.router.navigate(['/tasks']);
    }
  }
}
