import { createReducer, on } from '@ngrx/store';
import {
  loadDashboardStatistics,
  loadDashboardStatisticsSuccess,
  loadDashboardStatisticsFailure,
  loadUpcomingTasks,
  loadUpcomingTasksSuccess,
  loadUpcomingTasksFailure,
} from './dashboard.actions';
import { DashboardStatistics } from '../dashboard.types';
import { TaskReadModel } from '@angular-nest-starter/shared-types';

/**
 * Dashboard state interface
 */
export interface DashboardState {
  statistics: DashboardStatistics | null;
  upcomingTasks: TaskReadModel[];
  loading: boolean;
  error: string | null;
}

/**
 * Initial state for dashboard
 */
export const initialState: DashboardState = {
  statistics: null,
  upcomingTasks: [],
  loading: false,
  error: null,
};

/**
 * Helper functions for common state transitions
 */

/**
 * Set loading state to true and clear any errors
 */
const setLoading = (state: DashboardState): DashboardState => ({
  ...state,
  loading: true,
  error: null,
});

/**
 * Set loading state to false and set an error message
 */
const setError = (state: DashboardState, error: string): DashboardState => ({
  ...state,
  loading: false,
  error,
});

/**
 * Clear loading and error states
 */
const clearLoadingAndError = (state: DashboardState): DashboardState => ({
  ...state,
  loading: false,
  error: null,
});

/**
 * Dashboard reducer
 */
export const dashboardReducer = createReducer(
  initialState,

  // When loading dashboard statistics is triggered
  on(loadDashboardStatistics, setLoading),

  // When dashboard statistics are successfully loaded
  on(loadDashboardStatisticsSuccess, (state, { statistics }) => ({
    ...clearLoadingAndError(state),
    statistics,
  })),

  // When loading dashboard statistics fails
  on(loadDashboardStatisticsFailure, (state, { error }) => setError(state, error)),

  // When loading upcoming tasks is triggered
  on(loadUpcomingTasks, setLoading),

  // When upcoming tasks are successfully loaded
  on(loadUpcomingTasksSuccess, (state, { tasks }) => ({
    ...clearLoadingAndError(state),
    upcomingTasks: tasks,
  })),

  // When loading upcoming tasks fails
  on(loadUpcomingTasksFailure, (state, { error }) => setError(state, error))
);
