import { createAction, props } from '@ngrx/store';
import { DashboardStatistics } from '../dashboard.types';

/**
 * Load dashboard statistics from the backend
 */
export const loadDashboardStatistics = createAction(
  '[Dashboard] Load Statistics'
);

/**
 * Successfully loaded dashboard statistics from the backend
 */
export const loadDashboardStatisticsSuccess = createAction(
  '[Dashboard] Load Statistics Success',
  props<{ statistics: DashboardStatistics }>()
);

/**
 * Failed to load dashboard statistics from the backend
 */
export const loadDashboardStatisticsFailure = createAction(
  '[Dashboard] Load Statistics Failure',
  props<{ error: string }>()
);
