import { createAction, props } from '@ngrx/store';
import { DashboardStatistics } from '../dashboard.types';
import { TaskReadModel } from '@angular-nest-starter/application';

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

/**
 * Load upcoming tasks from the backend
 */
export const loadUpcomingTasks = createAction(
  '[Dashboard] Load Upcoming Tasks'
);

/**
 * Successfully loaded upcoming tasks from the backend
 */
export const loadUpcomingTasksSuccess = createAction(
  '[Dashboard] Load Upcoming Tasks Success',
  props<{ tasks: TaskReadModel[] }>()
);

/**
 * Failed to load upcoming tasks from the backend
 */
export const loadUpcomingTasksFailure = createAction(
  '[Dashboard] Load Upcoming Tasks Failure',
  props<{ error: string }>()
);
