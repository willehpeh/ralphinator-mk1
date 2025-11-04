import { createReducer, on } from '@ngrx/store';
import {
  createTask,
  createTaskSuccess,
  createTaskFailure
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
  on(createTaskFailure, (state, { error }) => setError(state, error))
);
