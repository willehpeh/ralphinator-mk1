import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { DashboardService } from '../dashboard.service';
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
  loadFollowUpCommunications,
  loadFollowUpCommunicationsSuccess,
  loadFollowUpCommunicationsFailure
} from './dashboard.actions';
import { createEffectErrorHandler } from '../../shared/effects-utils';

/**
 * NGRX Effects for dashboard-related side effects
 */
@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private dashboardService = inject(DashboardService);

  /**
   * Effect to load dashboard statistics from the backend
   * Listens for loadDashboardStatistics action, calls the service, and dispatches success/failure
   */
  loadDashboardStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDashboardStatistics),
      switchMap(() =>
        this.dashboardService.getDashboardStatistics().pipe(
          map((statistics) => loadDashboardStatisticsSuccess({ statistics })),
          catchError(createEffectErrorHandler(
            loadDashboardStatisticsFailure,
            'Failed to load dashboard statistics'
          ))
        )
      )
    )
  );

  /**
   * Effect to load upcoming tasks from the backend
   * Listens for loadUpcomingTasks action, calls the service, and dispatches success/failure
   */
  loadUpcomingTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUpcomingTasks),
      switchMap(() =>
        this.dashboardService.getUpcomingTasks().pipe(
          map((tasks) => loadUpcomingTasksSuccess({ tasks })),
          catchError(createEffectErrorHandler(
            loadUpcomingTasksFailure,
            'Failed to load upcoming tasks'
          ))
        )
      )
    )
  );

  /**
   * Effect to load overdue tasks from the backend
   * Listens for loadOverdueTasks action, calls the service, and dispatches success/failure
   */
  loadOverdueTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOverdueTasks),
      switchMap(() =>
        this.dashboardService.getOverdueTasks().pipe(
          map((tasks) => loadOverdueTasksSuccess({ tasks })),
          catchError(createEffectErrorHandler(
            loadOverdueTasksFailure,
            'Failed to load overdue tasks'
          ))
        )
      )
    )
  );

  /**
   * Effect to load recent communications from the backend
   * Listens for loadRecentCommunications action, calls the service, and dispatches success/failure
   */
  loadRecentCommunications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRecentCommunications),
      switchMap(() =>
        this.dashboardService.getRecentCommunications().pipe(
          map((communications) => loadRecentCommunicationsSuccess({ communications })),
          catchError(createEffectErrorHandler(
            loadRecentCommunicationsFailure,
            'Failed to load recent communications'
          ))
        )
      )
    )
  );

  /**
   * Effect to load follow-up communications from the backend
   * Listens for loadFollowUpCommunications action, calls the service, and dispatches success/failure
   */
  loadFollowUpCommunications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFollowUpCommunications),
      switchMap(() =>
        this.dashboardService.getFollowUpCommunications().pipe(
          map((communications) => loadFollowUpCommunicationsSuccess({ communications })),
          catchError(createEffectErrorHandler(
            loadFollowUpCommunicationsFailure,
            'Failed to load follow-up communications'
          ))
        )
      )
    )
  );
}
