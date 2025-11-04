import { createAction, props } from '@ngrx/store';
import { Task, CreateTaskInput } from '../task.types';

/**
 * Create a new task
 */
export const createTask = createAction(
  '[Tasks] Create Task',
  props<{ task: CreateTaskInput }>()
);

/**
 * Successfully created task
 */
export const createTaskSuccess = createAction(
  '[Tasks] Create Task Success',
  props<{ task: Task }>()
);

/**
 * Failed to create task
 */
export const createTaskFailure = createAction(
  '[Tasks] Create Task Failure',
  props<{ error: string }>()
);
