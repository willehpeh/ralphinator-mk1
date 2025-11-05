import { createAction, props } from '@ngrx/store';
import { DashboardStatistics } from '../dashboard.types';
import { TaskDto, CommunicationReadModel } from '@angular-nest-starter/shared-types';

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
  props<{ tasks: TaskDto[] }>()
);

/**
 * Failed to load upcoming tasks from the backend
 */
export const loadUpcomingTasksFailure = createAction(
  '[Dashboard] Load Upcoming Tasks Failure',
  props<{ error: string }>()
);

/**
 * Load overdue tasks from the backend
 */
export const loadOverdueTasks = createAction(
  '[Dashboard] Load Overdue Tasks'
);

/**
 * Successfully loaded overdue tasks from the backend
 */
export const loadOverdueTasksSuccess = createAction(
  '[Dashboard] Load Overdue Tasks Success',
  props<{ tasks: TaskDto[] }>()
);

/**
 * Failed to load overdue tasks from the backend
 */
export const loadOverdueTasksFailure = createAction(
  '[Dashboard] Load Overdue Tasks Failure',
  props<{ error: string }>()
);

/**
 * Load recent communications from the backend
 */
export const loadRecentCommunications = createAction(
  '[Dashboard] Load Recent Communications'
);

/**
 * Successfully loaded recent communications from the backend
 */
export const loadRecentCommunicationsSuccess = createAction(
  '[Dashboard] Load Recent Communications Success',
  props<{ communications: CommunicationReadModel[] }>()
);

/**
 * Failed to load recent communications from the backend
 */
export const loadRecentCommunicationsFailure = createAction(
  '[Dashboard] Load Recent Communications Failure',
  props<{ error: string }>()
);

/**
 * Load follow-up communications from the backend
 */
export const loadFollowUpCommunications = createAction(
  '[Dashboard] Load Follow-Up Communications'
);

/**
 * Successfully loaded follow-up communications from the backend
 */
export const loadFollowUpCommunicationsSuccess = createAction(
  '[Dashboard] Load Follow-Up Communications Success',
  props<{ communications: CommunicationReadModel[] }>()
);

/**
 * Failed to load follow-up communications from the backend
 */
export const loadFollowUpCommunicationsFailure = createAction(
  '[Dashboard] Load Follow-Up Communications Failure',
  props<{ error: string }>()
);
