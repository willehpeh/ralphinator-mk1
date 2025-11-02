import { createReducer, on } from '@ngrx/store';
import {
  Client,
  loadClients,
  loadClientsSuccess,
  loadClientsFailure,
  updateClient,
  updateClientSuccess,
  updateClientFailure
} from './clients.actions';

/**
 * Clients state interface
 */
export interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

/**
 * Initial state for clients
 */
export const initialState: ClientsState = {
  clients: [],
  loading: false,
  error: null,
};

/**
 * Clients reducer
 */
export const clientsReducer = createReducer(
  initialState,

  // When loading clients is triggered
  on(loadClients, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // When clients are successfully loaded
  on(loadClientsSuccess, (state, { clients }) => ({
    ...state,
    clients,
    loading: false,
    error: null,
  })),

  // When loading clients fails
  on(loadClientsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // When updating a client is triggered
  on(updateClient, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // When client is successfully updated
  // Note: The current implementation only receives the id in the success action.
  // The UI should dispatch loadClients after a successful update to refresh the list,
  // or this could be enhanced in a future task to return the full updated client.
  on(updateClientSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  // When updating client fails
  on(updateClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
