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
  loadUpcomingTasksFailure
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
}
