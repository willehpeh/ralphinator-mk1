import { Component, ChangeDetectionStrategy, inject, viewChild, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TaskFormComponent } from './task-form.component';
import { CreateTaskInput } from './task.types';
import { createTask } from './store/tasks.actions';
import { selectTasksError, selectTasksLoading } from './store/tasks.selectors';
import { SUCCESS_MESSAGE_DISMISS_DURATION_MS } from '../shared/ui.constants';

/**
 * Container component for adding a new task
 * Connects TaskFormComponent to NGRX store and handles navigation
 */
@Component({
  selector: 'app-add-task-page',
  imports: [TaskFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-task-page.component.html',
  styleUrl: './add-task-page.component.scss'
})
export class AddTaskPageComponent {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Get reference to TaskFormComponent to call its methods
  private taskForm = viewChild(TaskFormComponent);

  // Select state from store
  private isLoading = this.store.selectSignal(selectTasksLoading);
  private error = this.store.selectSignal(selectTasksError);

  constructor() {
    // Pre-populate form with query params
    effect(() => {
      const form = this.taskForm();
      if (form) {
        // Read query params and pre-populate form
        const queryParams = this.route.snapshot.queryParams;
        if (queryParams['projectId']) {
          form.form.patchValue({ projectId: queryParams['projectId'] });
        }
        if (queryParams['clientId']) {
          form.form.patchValue({ clientId: queryParams['clientId'] });
        }
      }
    });

    // React to loading state changes
    effect(() => {
      const form = this.taskForm();
      if (form) {
        form.setSubmitting(this.isLoading());
      }
    });

    // React to error state changes
    effect(() => {
      const errorMessage = this.error();
      const form = this.taskForm();
      if (form && errorMessage) {
        form.showError(errorMessage);
      }
    });

    // React to successful task creation
    effect(() => {
      const form = this.taskForm();
      const loading = this.isLoading();
      const errorMessage = this.error();

      // If we were loading and now we're not, and there's no error, it was successful
      if (form && !loading && !errorMessage) {
        // Check if we just finished a submission (form is not pristine)
        if (!form.form.pristine) {
          form.showSuccess('Task created successfully!', SUCCESS_MESSAGE_DISMISS_DURATION_MS);
          form.resetForm();

          // Navigate to tasks list after a brief delay
          setTimeout(() => {
            this.navigateToTaskList();
          }, SUCCESS_MESSAGE_DISMISS_DURATION_MS);
        }
      }
    });
  }

  /**
   * Handle task form submission
   * Dispatches createTask action to NGRX store
   */
  handleTaskSubmit(taskInput: CreateTaskInput): void {
    this.store.dispatch(createTask({ task: taskInput }));
  }

  /**
   * Handle form cancellation
   * Navigates back to task list
   */
  handleCancel(): void {
    this.navigateToTaskList();
  }

  /**
   * Navigate to the task list page
   */
  navigateToTaskList(): void {
    this.router.navigate(['/tasks']);
  }
}
