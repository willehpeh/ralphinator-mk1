import { createReducer, on } from '@ngrx/store';
import { Client, loadClients, loadClientsSuccess, loadClientsFailure } from './clients.actions';

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
  }))
);
