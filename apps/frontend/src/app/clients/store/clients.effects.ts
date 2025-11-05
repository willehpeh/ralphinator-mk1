import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { ClientsService } from '../clients.service';
import { loadClients, loadClientsSuccess, loadClientsFailure, updateClient, updateClientSuccess, updateClientFailure, changeClientStatus, changeClientStatusSuccess, changeClientStatusFailure, filterClientsByStatus, filterClientsByStatusSuccess, filterClientsByStatusFailure, deleteClient, deleteClientSuccess, deleteClientFailure } from './clients.actions';
import { ClientNavigationService } from '../client-navigation.service';
import { CLIENT_ERROR_MESSAGES } from '../client-display.constants';
import { createEffectErrorHandler } from '../../shared/effects-utils';

/**
 * NGRX Effects for client-related side effects
 */
@Injectable()
export class ClientsEffects {
  private actions$ = inject(Actions);
  private clientsService = inject(ClientsService);
  private navigation = inject(ClientNavigationService);

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
          catchError(createEffectErrorHandler(loadClientsFailure, CLIENT_ERROR_MESSAGES.LOAD_CLIENTS_FAILED))
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
          map((client) => updateClientSuccess({ client })),
          catchError(createEffectErrorHandler(updateClientFailure, CLIENT_ERROR_MESSAGES.UPDATE_CLIENT_FAILED))
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
          catchError(createEffectErrorHandler(changeClientStatusFailure, CLIENT_ERROR_MESSAGES.CHANGE_STATUS_FAILED))
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
          catchError(createEffectErrorHandler(filterClientsByStatusFailure, CLIENT_ERROR_MESSAGES.FILTER_BY_STATUS_FAILED))
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
          catchError(createEffectErrorHandler(deleteClientFailure, CLIENT_ERROR_MESSAGES.DELETE_CLIENT_FAILED))
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
        tap(() => this.navigation.toClientList())
      ),
    { dispatch: false }
  );
}
