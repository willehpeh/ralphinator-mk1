import { createReducer, on } from '@ngrx/store';
import {
  Client,
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
  filterClientsByName
} from './clients.actions';

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
    allClients: clients, // Store all clients for filtering
    searchTerm: '', // Reset search term
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
  on(updateClientSuccess, (state, { client }) => ({
    ...state,
    clients: state.clients.map((c) => (c.id === client.id ? client : c)),
    loading: false,
    error: null,
  })),

  // When updating client fails
  on(updateClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // When changing client status is triggered
  on(changeClientStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // When client status is successfully changed
  on(changeClientStatusSuccess, (state, { client }) => ({
    ...state,
    clients: state.clients.map((c) => (c.id === client.id ? client : c)),
    loading: false,
    error: null,
  })),

  // When changing client status fails
  on(changeClientStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // When filtering clients by status is triggered
  on(filterClientsByStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // When clients are successfully filtered by status
  on(filterClientsByStatusSuccess, (state, { clients }) => ({
    ...state,
    clients,
    allClients: clients, // Update all clients for filtering
    searchTerm: '', // Reset search term when status filter changes
    loading: false,
    error: null,
  })),

  // When filtering clients by status fails
  on(filterClientsByStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // When filtering clients by name (client-side filtering)
  on(filterClientsByName, (state, { searchTerm }) => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    // If search term is empty, show all clients
    if (!normalizedSearch) {
      return {
        ...state,
        clients: state.allClients,
        searchTerm: ''
      };
    }

    // Filter clients by company name (case-insensitive)
    const filtered = state.allClients.filter(client =>
      client.companyName.toLowerCase().includes(normalizedSearch)
    );

    return {
      ...state,
      clients: filtered,
      searchTerm
    };
  })
);
