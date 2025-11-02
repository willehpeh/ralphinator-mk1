import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { ClientsService } from '../clients.service';
import { loadClients, loadClientsSuccess, loadClientsFailure, updateClient, updateClientSuccess, updateClientFailure, changeClientStatus, changeClientStatusSuccess, changeClientStatusFailure, filterClientsByStatus, filterClientsByStatusSuccess, filterClientsByStatusFailure, deleteClient, deleteClientSuccess, deleteClientFailure } from './clients.actions';
import { CLIENT_ROUTES } from '../client-routes.constants';

/**
 * NGRX Effects for client-related side effects
 */
@Injectable()
export class ClientsEffects {
  private actions$ = inject(Actions);
  private clientsService = inject(ClientsService);
  private router = inject(Router);

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
          phone: action.phone ?? undefined,
          address: action.address ?? undefined,
          status: action.status,
          notes: action.notes ?? undefined,
        }).pipe(
          map((client) => updateClientSuccess({ client })),
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
          map((client) => changeClientStatusSuccess({ client })),
          catchError((error) =>
            of(changeClientStatusFailure({ error: error?.message || 'Failed to change client status' }))
          )
        )
      )
    )
  );

  /**
   * Effect to filter clients by status from the backend
   * Listens for filterClientsByStatus action, calls the service, and dispatches success/failure
   */
  filterClientsByStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(filterClientsByStatus),
      switchMap((action) =>
        this.clientsService.getClientsByStatus(action.status).pipe(
          map((clients) => filterClientsByStatusSuccess({ clients })),
          catchError((error) =>
            of(filterClientsByStatusFailure({ error: error?.message || 'Failed to filter clients by status' }))
          )
        )
      )
    )
  );

  /**
   * Effect to delete a client from the backend
   * Listens for deleteClient action, calls the service, and dispatches success/failure
   */
  deleteClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteClient),
      switchMap((action) =>
        this.clientsService.deleteClient(action.id).pipe(
          map((response) => deleteClientSuccess({ id: response.id })),
          catchError((error) =>
            of(deleteClientFailure({ error: error?.message || 'Failed to delete client' }))
          )
        )
      )
    )
  );

  /**
   * Effect to navigate to client list after successful deletion
   * Listens for deleteClientSuccess action and navigates to client list
   */
  deleteClientSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteClientSuccess),
        tap(() => this.router.navigate([CLIENT_ROUTES.BASE]))
      ),
    { dispatch: false }
  );
}
