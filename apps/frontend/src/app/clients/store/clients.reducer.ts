import { createReducer, on } from '@ngrx/store';
import {
  loadClients,
  loadClientsSuccess,
  loadClientsFailure,
  updateClient,
  updateClientSuccess,
  updateClientFailure,
  changeClientStatus,
  changeClientStatusSuccess,
  changeClientStatusFailure,
  filterClientsByStatus,
  filterClientsByStatusSuccess,
  filterClientsByStatusFailure,
  filterClientsByName,
  deleteClient,
  deleteClientSuccess,
  deleteClientFailure
} from './clients.actions';
import { Client } from '../client.types';

/**
 * Clients state interface
 */
export interface ClientsState {
  clients: Client[];
  allClients: Client[]; // Store all clients for filtering
  searchTerm: string; // Current search term
  loading: boolean;
  error: string | null;
}

/**
 * Initial state for clients
 */
export const initialState: ClientsState = {
  clients: [],
  allClients: [],
  searchTerm: '',
  loading: false,
  error: null,
};

/**
 * Helper functions for common state transitions
 */

/**
 * Set loading state to true and clear any errors
 */
const setLoading = (state: ClientsState): ClientsState => ({
  ...state,
  loading: true,
  error: null,
});

/**
 * Set loading state to false and set an error message
 */
const setError = (state: ClientsState, error: string): ClientsState => ({
  ...state,
  loading: false,
  error,
});

/**
 * Clear loading and error states
 */
const clearLoadingAndError = (state: ClientsState): ClientsState => ({
  ...state,
  loading: false,
  error: null,
});

/**
 * Filter clients by search term (case-insensitive, trimmed)
 * Returns all clients if search term is empty after normalization
 */
const filterClientsBySearchTerm = (clients: Client[], searchTerm: string): Client[] => {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  if (!normalizedSearch) {
    return clients;
  }

  return clients.filter(client =>
    client.companyName.toLowerCase().includes(normalizedSearch)
  );
};

/**
 * Clients reducer
 */
export const clientsReducer = createReducer(
  initialState,

  // When loading clients is triggered
  on(loadClients, setLoading),

  // When clients are successfully loaded
  on(loadClientsSuccess, (state, { clients }) => ({
    ...clearLoadingAndError(state),
    clients,
    allClients: clients, // Store all clients for filtering
    searchTerm: '', // Reset search term
  })),

  // When loading clients fails
  on(loadClientsFailure, (state, { error }) => setError(state, error)),

  // When updating a client is triggered
  on(updateClient, setLoading),

  // When client is successfully updated
  on(updateClientSuccess, (state, { client }) => ({
    ...clearLoadingAndError(state),
    clients: state.clients.map((c) => (c.id === client.id ? client : c)),
  })),

  // When updating client fails
  on(updateClientFailure, (state, { error }) => setError(state, error)),

  // When changing client status is triggered
  on(changeClientStatus, setLoading),

  // When client status is successfully changed
  on(changeClientStatusSuccess, (state, { client }) => ({
    ...clearLoadingAndError(state),
    clients: state.clients.map((c) => (c.id === client.id ? client : c)),
  })),

  // When changing client status fails
  on(changeClientStatusFailure, (state, { error }) => setError(state, error)),

  // When filtering clients by status is triggered
  on(filterClientsByStatus, setLoading),

  // When clients are successfully filtered by status
  on(filterClientsByStatusSuccess, (state, { clients }) => {
    // Preserve and apply existing search term to newly filtered clients
    const filteredClients = filterClientsBySearchTerm(clients, state.searchTerm);

    return {
      ...clearLoadingAndError(state),
      clients: filteredClients,
      allClients: clients, // Update all clients for filtering
      // Preserve search term instead of resetting it
    };
  }),

  // When filtering clients by status fails
  on(filterClientsByStatusFailure, (state, { error }) => setError(state, error)),

  // When filtering clients by name (client-side filtering)
  on(filterClientsByName, (state, { searchTerm }) => {
    // Filter clients by company name (case-insensitive)
    const filtered = filterClientsBySearchTerm(state.allClients, searchTerm);

    return {
      ...state,
      clients: filtered,
      searchTerm: searchTerm.toLowerCase().trim() ? searchTerm : ''
    };
  }),

  // When deleting a client is triggered
  on(deleteClient, setLoading),

  // When client is successfully deleted
  on(deleteClientSuccess, (state, { id }) => ({
    ...clearLoadingAndError(state),
    clients: state.clients.filter((c) => c.id !== id),
    allClients: state.allClients.filter((c) => c.id !== id),
  })),

  // When deleting client fails
  on(deleteClientFailure, (state, { error }) => setError(state, error))
);
