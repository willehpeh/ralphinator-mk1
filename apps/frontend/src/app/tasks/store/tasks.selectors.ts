import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.reducer';

/**
 * Feature selector for the tasks state
 */
export const selectTasksState = createFeatureSelector<TasksState>('tasks');

/**
 * Select all tasks from the state
 */
export const selectAllTasks = createSelector(
  selectTasksState,
  (state: TasksState) => state.tasks
);

/**
 * Select the loading status
 */
export const selectTasksLoading = createSelector(
  selectTasksState,
  (state: TasksState) => state.loading
);

/**
 * Select the error message
 */
export const selectTasksError = createSelector(
  selectTasksState,
  (state: TasksState) => state.error
);

/**
 * Select whether there are any tasks
 */
export const selectHasTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.length > 0
);

/**
 * Select a specific task by ID
 */
export const selectTaskById = (id: string) => createSelector(
  selectAllTasks,
  (tasks) => tasks.find(task => task.id === id) ?? null
);
