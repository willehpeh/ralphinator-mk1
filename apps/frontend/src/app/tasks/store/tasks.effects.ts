import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { TasksService } from '../tasks.service';
import { createTask, createTaskSuccess, createTaskFailure, updateTask, updateTaskSuccess, updateTaskFailure, changeTaskStatus, changeTaskStatusSuccess, changeTaskStatusFailure, loadTasks, loadTasksSuccess, loadTasksFailure, deleteTask, deleteTaskSuccess, deleteTaskFailure, loadProjectTasks, loadProjectTasksSuccess, loadProjectTasksFailure } from './tasks.actions';
import { createEffectErrorHandler } from '../../shared/effects-utils';

/**
 * NGRX Effects for task-related side effects
 */
@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private tasksService = inject(TasksService);

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
          catchError(createEffectErrorHandler(createTaskFailure, 'Failed to create task'))
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
          catchError(createEffectErrorHandler(updateTaskFailure, 'Failed to update task'))
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
          catchError(createEffectErrorHandler(changeTaskStatusFailure, 'Failed to change task status'))
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
          catchError(createEffectErrorHandler(loadTasksFailure, 'Failed to load tasks'))
        )
      )
    )
  );

  /**
   * Effect to delete a task from the backend
   * Listens for deleteTask action, calls the service, and dispatches success/failure
   */
  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTask),
      switchMap((action) =>
        this.tasksService.deleteTask(action.id).pipe(
          map(() => deleteTaskSuccess({ id: action.id })),
          catchError(createEffectErrorHandler(deleteTaskFailure, 'Failed to delete task'))
        )
      )
    )
  );

  /**
   * Effect to load tasks for a specific project from the backend
   * Listens for loadProjectTasks action, calls the service, and dispatches success/failure
   */
  loadProjectTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProjectTasks),
      switchMap((action) =>
        this.tasksService.getTasksByProjectId(action.projectId).pipe(
          map((tasks) => loadProjectTasksSuccess({ tasks })),
          catchError(createEffectErrorHandler(loadProjectTasksFailure, 'Failed to load project tasks'))
        )
      )
    )
  );
}
