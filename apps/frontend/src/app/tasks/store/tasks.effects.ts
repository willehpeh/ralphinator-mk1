import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { TasksService } from '../tasks.service';
import { createTask, createTaskSuccess, createTaskFailure } from './tasks.actions';

/**
 * NGRX Effects for task-related side effects
 */
@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private tasksService = inject(TasksService);

  /**
   * Creates a reusable error handler for effects
   * @param failureAction - The action creator to dispatch on error
   * @param defaultMessage - The default error message to use
   * @returns An observable of the failure action
   */
  private handleError<T>(
    failureAction: (payload: { error: string }) => T,
    defaultMessage: string
  ) {
    return (error: unknown) =>
      of(failureAction({ error: (error as Error)?.message || defaultMessage }));
  }

  /**
   * Effect to create a task in the backend
   * Listens for createTask action, calls the service, and dispatches success/failure
   */
  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTask),
      switchMap((action) =>
        this.tasksService.createTask(action.task).pipe(
          map((response) => createTaskSuccess({ task: { id: response.id, ...action.task } })),
          catchError(this.handleError(createTaskFailure, 'Failed to create task'))
        )
      )
    )
  );
}
