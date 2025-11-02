import { createAction, props } from '@ngrx/store';

/**
 * Client interface matching the backend ClientReadModel
 */
export interface Client {
  id: string;
  companyName: string;
  email: string;
  phone: string | null;
  address: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  notes: string | null;
  createdAt: string;
}

/**
 * Load all clients from the backend
 */
export const loadClients = createAction('[Clients] Load Clients');

/**
 * Successfully loaded clients from the backend
 */
export const loadClientsSuccess = createAction(
  '[Clients] Load Clients Success',
  props<{ clients: Client[] }>()
);

/**
 * Failed to load clients from the backend
 */
export const loadClientsFailure = createAction(
  '[Clients] Load Clients Failure',
  props<{ error: string }>()
);
