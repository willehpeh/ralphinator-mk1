import { createReducer, on } from '@ngrx/store';
import {
  createTask,
  createTaskSuccess,
  createTaskFailure,
  loadTasks,
  loadTasksSuccess,
  loadTasksFailure,
  updateTask,
  updateTaskSuccess,
  updateTaskFailure,
  changeTaskStatus,
  changeTaskStatusSuccess,
  changeTaskStatusFailure,
  deleteTask,
  deleteTaskSuccess,
  deleteTaskFailure
} from './tasks.actions';
import { Task } from '../task.types';

/**
 * Tasks state interface
 */
export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

/**
 * Initial state for tasks
 */
export const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

/**
 * Helper functions for common state transitions
 */

/**
 * Set loading state to true and clear any errors
 */
const setLoading = (state: TasksState): TasksState => ({
  ...state,
  loading: true,
  error: null,
});

/**
 * Set loading state to false and set an error message
 */
const setError = (state: TasksState, error: string): TasksState => ({
  ...state,
  loading: false,
  error,
});

/**
 * Clear loading and error states
 */
const clearLoadingAndError = (state: TasksState): TasksState => ({
  ...state,
  loading: false,
  error: null,
});

/**
 * Tasks reducer
 */
export const tasksReducer = createReducer(
  initialState,

  // When creating a task is triggered
  on(createTask, setLoading),

  // When task is successfully created
  on(createTaskSuccess, (state, { task }) => ({
    ...clearLoadingAndError(state),
    tasks: [...state.tasks, task],
  })),

  // When creating task fails
  on(createTaskFailure, (state, { error }) => setError(state, error)),

  // When loading tasks is triggered
  on(loadTasks, setLoading),

  // When tasks are successfully loaded
  on(loadTasksSuccess, (state, { tasks }) => ({
    ...clearLoadingAndError(state),
    tasks,
  })),

  // When loading tasks fails
  on(loadTasksFailure, (state, { error }) => setError(state, error)),

  // When updating a task is triggered
  on(updateTask, setLoading),

  // When task is successfully updated
  on(updateTaskSuccess, (state, { task }) => ({
    ...clearLoadingAndError(state),
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
  })),

  // When updating task fails
  on(updateTaskFailure, (state, { error }) => setError(state, error)),

  // When changing task status is triggered
  on(changeTaskStatus, setLoading),

  // When task status is successfully changed
  on(changeTaskStatusSuccess, (state, { task }) => ({
    ...clearLoadingAndError(state),
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
  })),

  // When changing task status fails
  on(changeTaskStatusFailure, (state, { error }) => setError(state, error)),

  // When deleting a task is triggered
  on(deleteTask, setLoading),

  // When task is successfully deleted
  on(deleteTaskSuccess, (state, { id }) => ({
    ...clearLoadingAndError(state),
    tasks: state.tasks.filter(t => t.id !== id),
  })),

  // When deleting task fails
  on(deleteTaskFailure, (state, { error }) => setError(state, error))
);
