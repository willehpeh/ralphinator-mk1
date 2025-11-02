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
  on(filterClientsByStatusSuccess, (state, { clients }) => {
    // Preserve and apply existing search term to newly filtered clients
    const normalizedSearch = state.searchTerm.toLowerCase().trim();

    // If there's an active search term, filter the status-filtered results
    const filteredClients = normalizedSearch
      ? clients.filter(client =>
          client.companyName.toLowerCase().includes(normalizedSearch)
        )
      : clients;

    return {
      ...state,
      clients: filteredClients,
      allClients: clients, // Update all clients for filtering
      // Preserve search term instead of resetting it
      loading: false,
      error: null,
    };
  }),

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
  }),

  // When deleting a client is triggered
  on(deleteClient, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // When client is successfully deleted
  on(deleteClientSuccess, (state, { id }) => ({
    ...state,
    clients: state.clients.filter((c) => c.id !== id),
    allClients: state.allClients.filter((c) => c.id !== id),
    loading: false,
    error: null,
  })),

  // When deleting client fails
  on(deleteClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
