import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ClientsService } from '../clients.service';
import { loadClients, loadClientsSuccess, loadClientsFailure, updateClient, updateClientSuccess, updateClientFailure, changeClientStatus, changeClientStatusSuccess, changeClientStatusFailure } from './clients.actions';

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

  /**
   * Effect to update a client in the backend
   * Listens for updateClient action, calls the service, and dispatches success/failure
   */
  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateClient),
      switchMap((action) =>
        this.clientsService.updateClient(action.id, {
          companyName: action.companyName,
          email: action.email,
          phone: action.phone,
          address: action.address,
          status: action.status,
          notes: action.notes,
        }).pipe(
          map((response) => updateClientSuccess({ id: response.id })),
          catchError((error) =>
            of(updateClientFailure({ error: error?.message || 'Failed to update client' }))
          )
        )
      )
    )
  );

  /**
   * Effect to change a client's status in the backend
   * Listens for changeClientStatus action, calls the service, and dispatches success/failure
   */
  changeClientStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeClientStatus),
      switchMap((action) =>
        this.clientsService.changeClientStatus(action.id, {
          status: action.status,
        }).pipe(
          map((response) => changeClientStatusSuccess({ id: response.id })),
          catchError((error) =>
            of(changeClientStatusFailure({ error: error?.message || 'Failed to change client status' }))
          )
        )
      )
    )
  );
}
