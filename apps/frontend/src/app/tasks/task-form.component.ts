import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTaskInput } from './task.types';
import { TASK_STATUSES, TASK_PRIORITIES, DEFAULT_TASK_STATUS, DEFAULT_TASK_PRIORITY } from './task.constants';
import { TASK_FORM_LABELS, TASK_UI_TEXT } from './task-display.constants';
import { FormState } from '../shared/form-state';
import { ValidationErrorComponent } from '../shared/validation-error.component';
import { TaskStatus, TaskPriority } from '@angular-nest-starter/shared-types';

interface TaskFormFields {
  title: FormControl<string>;
  notes: FormControl<string>;
  status: FormControl<TaskStatus>;
  priority: FormControl<TaskPriority>;
  dueDate: FormControl<string>;
  clientId: FormControl<string>;
  projectId: FormControl<string>;
}

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule, ValidationErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './task-form.component.scss',
  template: `
    <div class="task-form">
      <h2>{{ formTitle }}</h2>

      @if (formState.successMessage()) {
        <div class="success-message">
          {{ TASK_UI_TEXT.TASK_CREATED_SUCCESS }}
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
              {{ TASK_FORM_LABELS.SUBMITTING_BUTTON }}
            } @else {
              {{ TASK_FORM_LABELS.ADD_TASK_BUTTON }}
            }
          </button>
          <button type="button" (click)="onCancel()" [disabled]="formState.isSubmitting()">
            {{ TASK_FORM_LABELS.CANCEL_BUTTON }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class TaskFormComponent {
  // Outputs
  taskSubmitted = output<CreateTaskInput>();
  formCancelled = output<void>();

  // Constants for template
  readonly TASK_FORM_LABELS = TASK_FORM_LABELS;
  readonly TASK_UI_TEXT = TASK_UI_TEXT;

  // Available options
  readonly availableStatuses = TASK_STATUSES;
  readonly availablePriorities = TASK_PRIORITIES;

  // Form title
  readonly formTitle = TASK_UI_TEXT.ADD_TASK_TITLE;

  form = new FormGroup<TaskFormFields>({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true }),
    status: new FormControl<TaskStatus>(DEFAULT_TASK_STATUS, { nonNullable: true, validators: [Validators.required] }),
    priority: new FormControl<TaskPriority>(DEFAULT_TASK_PRIORITY, { nonNullable: true, validators: [Validators.required] }),
    dueDate: new FormControl('', { nonNullable: true }),
    clientId: new FormControl('', { nonNullable: true }),
    projectId: new FormControl('', { nonNullable: true })
  });

  formState = new FormState();

  onSubmit(): void {
    if (this.form.valid && !this.formState.isSubmitting()) {
      const formValue = this.form.getRawValue();

      const taskInput: CreateTaskInput = {
        title: formValue.title,
        status: formValue.status,
        priority: formValue.priority,
        notes: formValue.notes || null,
        dueDate: formValue.dueDate || null,
        clientId: formValue.clientId || null,
        projectId: formValue.projectId || null
      };

      this.taskSubmitted.emit(taskInput);
    }
  }

  onCancel(): void {
    this.form.reset({
      status: DEFAULT_TASK_STATUS,
      priority: DEFAULT_TASK_PRIORITY
    });
    this.formState.reset();
    this.formCancelled.emit();
  }

  /**
   * Method to be called by parent component to reset form after successful submission
   */
  resetForm(): void {
    this.form.reset({
      status: DEFAULT_TASK_STATUS,
      priority: DEFAULT_TASK_PRIORITY
    });
    this.formState.reset();
  }

  /**
   * Method to be called by parent component to show success message
   */
  showSuccess(message: string, autoHideDurationMs?: number): void {
    this.formState.setSuccess(message, autoHideDurationMs);
  }

  /**
   * Method to be called by parent component to show error message
   */
  showError(message: string): void {
    this.formState.setError(message);
  }

  /**
   * Method to be called by parent component to set submitting state
   */
  setSubmitting(isSubmitting: boolean): void {
    this.formState.setSubmitting(isSubmitting);
  }
}
