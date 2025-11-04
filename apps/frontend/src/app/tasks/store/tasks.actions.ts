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

/**
 * Load all tasks
 */
export const loadTasks = createAction(
  '[Tasks] Load Tasks'
);

/**
 * Successfully loaded tasks
 */
export const loadTasksSuccess = createAction(
  '[Tasks] Load Tasks Success',
  props<{ tasks: Task[] }>()
);

/**
 * Failed to load tasks
 */
export const loadTasksFailure = createAction(
  '[Tasks] Load Tasks Failure',
  props<{ error: string }>()
);
