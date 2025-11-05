import { createReducer, on } from '@ngrx/store';
import {
  loadDashboardStatistics,
  loadDashboardStatisticsSuccess,
  loadDashboardStatisticsFailure,
  loadUpcomingTasks,
  loadUpcomingTasksSuccess,
  loadUpcomingTasksFailure,
  loadOverdueTasks,
  loadOverdueTasksSuccess,
  loadOverdueTasksFailure,
  loadRecentCommunications,
  loadRecentCommunicationsSuccess,
  loadRecentCommunicationsFailure,
} from './dashboard.actions';
import { DashboardStatistics } from '../dashboard.types';
import { TaskReadModel, CommunicationReadModel } from '@angular-nest-starter/shared-types';

/**
 * Dashboard state interface
 */
export interface DashboardState {
  statistics: DashboardStatistics | null;
  upcomingTasks: TaskReadModel[];
  overdueTasks: TaskReadModel[];
  recentCommunications: CommunicationReadModel[];
  loading: boolean;
  error: string | null;
}

/**
 * Initial state for dashboard
 */
export const initialState: DashboardState = {
  statistics: null,
  upcomingTasks: [],
  overdueTasks: [],
  recentCommunications: [],
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
  on(loadUpcomingTasksFailure, (state, { error }) => setError(state, error)),

  // When loading overdue tasks is triggered
  on(loadOverdueTasks, setLoading),

  // When overdue tasks are successfully loaded
  on(loadOverdueTasksSuccess, (state, { tasks }) => ({
    ...clearLoadingAndError(state),
    overdueTasks: tasks,
  })),

  // When loading overdue tasks fails
  on(loadOverdueTasksFailure, (state, { error }) => setError(state, error)),

  // When loading recent communications is triggered
  on(loadRecentCommunications, setLoading),

  // When recent communications are successfully loaded
  on(loadRecentCommunicationsSuccess, (state, { communications }) => ({
    ...clearLoadingAndError(state),
    recentCommunications: communications,
  })),

  // When loading recent communications fails
  on(loadRecentCommunicationsFailure, (state, { error }) => setError(state, error))
);
