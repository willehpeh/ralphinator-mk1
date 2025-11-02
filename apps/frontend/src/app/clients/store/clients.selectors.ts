import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientsState } from './clients.reducer';

/**
 * Feature selector for the clients state
 */
export const selectClientsState = createFeatureSelector<ClientsState>('clients');

/**
 * Select all clients from the state
 */
export const selectAllClients = createSelector(
  selectClientsState,
  (state: ClientsState) => state.clients
);

/**
 * Select the loading status
 */
export const selectClientsLoading = createSelector(
  selectClientsState,
  (state: ClientsState) => state.loading
);

/**
 * Select the error message
 */
export const selectClientsError = createSelector(
  selectClientsState,
  (state: ClientsState) => state.error
);

/**
 * Select whether there are any clients
 */
export const selectHasClients = createSelector(
  selectAllClients,
  (clients) => clients.length > 0
);

/**
 * Select the total number of clients
 */
export const selectClientsCount = createSelector(
  selectAllClients,
  (clients) => clients.length
);

/**
 * Select active clients only
 */
export const selectActiveClients = createSelector(
  selectAllClients,
  (clients) => clients.filter(client => client.status === 'Active')
);

/**
 * Select inactive clients only
 */
export const selectInactiveClients = createSelector(
  selectAllClients,
  (clients) => clients.filter(client => client.status === 'Inactive')
);

/**
 * Select a specific client by ID
 */
export const selectClientById = (id: string) => createSelector(
  selectAllClients,
  (clients) => clients.find(client => client.id === id) ?? null
);
