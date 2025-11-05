import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.reducer';

/**
 * Feature selector for the dashboard state
 */
export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

/**
 * Select dashboard statistics from the state
 */
export const selectDashboardStatistics = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.statistics
);

/**
 * Select the loading status
 */
export const selectDashboardLoading = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.loading
);

/**
 * Select the error message
 */
export const selectDashboardError = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.error
);

/**
 * Select whether statistics have been loaded
 */
export const selectHasStatistics = createSelector(
  selectDashboardStatistics,
  (statistics) => statistics !== null
);

/**
 * Select individual statistic values
 */
export const selectActiveClientsCount = createSelector(
  selectDashboardStatistics,
  (statistics) => statistics?.activeClientsCount ?? 0
);

export const selectActiveProjectsCount = createSelector(
  selectDashboardStatistics,
  (statistics) => statistics?.activeProjectsCount ?? 0
);

export const selectPendingTasksCount = createSelector(
  selectDashboardStatistics,
  (statistics) => statistics?.pendingTasksCount ?? 0
);

export const selectFollowUpsRequiredCount = createSelector(
  selectDashboardStatistics,
  (statistics) => statistics?.followUpsRequiredCount ?? 0
);

/**
 * Select upcoming tasks from the state
 */
export const selectUpcomingTasks = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.upcomingTasks
);

/**
 * Select overdue tasks from the state
 */
export const selectOverdueTasks = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.overdueTasks
);
