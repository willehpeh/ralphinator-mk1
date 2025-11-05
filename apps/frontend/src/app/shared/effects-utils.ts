import { of } from 'rxjs';

/**
 * Shared utility functions for NGRX effects
 */

/**
 * Creates a reusable error handler for effects
 *
 * This function standardizes error handling across all NGRX effects,
 * ensuring consistent error message extraction and failure action dispatch.
 *
 * @param failureAction - The action creator to dispatch on error
 * @param defaultMessage - The default error message to use if error message is unavailable
 * @returns A function that takes an error and returns an observable of the failure action
 *
 * @example
 * ```typescript
 * loadClients$ = createEffect(() =>
 *   this.actions$.pipe(
 *     ofType(loadClients),
 *     switchMap(() =>
 *       this.clientsService.getAllClients().pipe(
 *         map((clients) => loadClientsSuccess({ clients })),
 *         catchError(createEffectErrorHandler(loadClientsFailure, 'Failed to load clients'))
 *       )
 *     )
 *   )
 * );
 * ```
 */
export function createEffectErrorHandler<T>(
  failureAction: (payload: { error: string }) => T,
  defaultMessage: string
) {
  return (error: unknown) =>
    of(failureAction({ error: (error as Error)?.message || defaultMessage }));
}
