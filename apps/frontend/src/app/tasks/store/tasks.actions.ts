import { createAction, props } from '@ngrx/store';
import { Task, CreateTaskInput, UpdateTaskInput } from '../task.types';
import { TaskStatus } from '@angular-nest-starter/shared-types';

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
 * Update an existing task
 */
export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ id: string; task: UpdateTaskInput }>()
);

/**
 * Successfully updated task
 */
export const updateTaskSuccess = createAction(
  '[Tasks] Update Task Success',
  props<{ task: Task }>()
);

/**
 * Failed to update task
 */
export const updateTaskFailure = createAction(
  '[Tasks] Update Task Failure',
  props<{ error: string }>()
);

/**
 * Change task status
 */
export const changeTaskStatus = createAction(
  '[Tasks] Change Task Status',
  props<{ id: string; status: TaskStatus }>()
);

/**
 * Successfully changed task status
 */
export const changeTaskStatusSuccess = createAction(
  '[Tasks] Change Task Status Success',
  props<{ task: Task }>()
);

/**
 * Failed to change task status
 */
export const changeTaskStatusFailure = createAction(
  '[Tasks] Change Task Status Failure',
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

/**
 * Delete a task
 */
export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ id: string }>()
);

/**
 * Successfully deleted task
 */
export const deleteTaskSuccess = createAction(
  '[Tasks] Delete Task Success',
  props<{ id: string }>()
);

/**
 * Failed to delete task
 */
export const deleteTaskFailure = createAction(
  '[Tasks] Delete Task Failure',
  props<{ error: string }>()
);
