import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { TasksService } from '../tasks.service';
import { createTask, createTaskSuccess, createTaskFailure, updateTask, updateTaskSuccess, updateTaskFailure, changeTaskStatus, changeTaskStatusSuccess, changeTaskStatusFailure, loadTasks, loadTasksSuccess, loadTasksFailure } from './tasks.actions';

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
          map((response) => createTaskSuccess({
            task: {
              id: response.id,
              title: action.task.title,
              notes: action.task.notes ?? null,
              priority: action.task.priority,
              status: action.task.status,
              dueDate: action.task.dueDate ? new Date(action.task.dueDate) : null,
              clientId: action.task.clientId ?? null,
              projectId: action.task.projectId ?? null,
              createdAt: new Date()
            }
          })),
          catchError(this.handleError(createTaskFailure, 'Failed to create task'))
        )
      )
    )
  );

  /**
   * Effect to update a task in the backend
   * Listens for updateTask action, calls the service, and dispatches success/failure
   */
  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTask),
      switchMap((action) =>
        this.tasksService.updateTask(action.id, action.task).pipe(
          map((task) => updateTaskSuccess({ task })),
          catchError(this.handleError(updateTaskFailure, 'Failed to update task'))
        )
      )
    )
  );

  /**
   * Effect to change task status in the backend
   * Listens for changeTaskStatus action, calls the service, and dispatches success/failure
   */
  changeTaskStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeTaskStatus),
      switchMap((action) =>
        this.tasksService.changeTaskStatus(action.id, { status: action.status }).pipe(
          map((task) => changeTaskStatusSuccess({ task })),
          catchError(this.handleError(changeTaskStatusFailure, 'Failed to change task status'))
        )
      )
    )
  );

  /**
   * Effect to load all tasks from the backend
   * Listens for loadTasks action, calls the service, and dispatches success/failure
   */
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTasks),
      switchMap(() =>
        this.tasksService.getAllTasks().pipe(
          map((tasks) => loadTasksSuccess({ tasks })),
          catchError(this.handleError(loadTasksFailure, 'Failed to load tasks'))
        )
      )
    )
  );
}
