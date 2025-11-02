import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ClientsService } from '../clients.service';
import { loadClients, loadClientsSuccess, loadClientsFailure } from './clients.actions';

/**
 * NGRX Effects for client-related side effects
 */
@Injectable()
export class ClientsEffects {
  private actions$ = inject(Actions);
  private clientsService = inject(ClientsService);

  /**
   * Effect to load all clients from the backend
   * Listens for loadClients action, calls the service, and dispatches success/failure
   */
  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadClients),
      switchMap(() =>
        this.clientsService.getAllClients().pipe(
          map((clients) => loadClientsSuccess({ clients })),
          catchError((error) =>
            of(loadClientsFailure({ error: error?.message || 'Failed to load clients' }))
          )
        )
      )
    )
  );
}
