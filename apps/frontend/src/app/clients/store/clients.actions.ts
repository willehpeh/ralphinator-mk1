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

/**
 * Update an existing client
 */
export const updateClient = createAction(
  '[Clients] Update Client',
  props<{
    id: string;
    companyName: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    notes: string | null;
  }>()
);

/**
 * Successfully updated client
 */
export const updateClientSuccess = createAction(
  '[Clients] Update Client Success',
  props<{ id: string }>()
);

/**
 * Failed to update client
 */
export const updateClientFailure = createAction(
  '[Clients] Update Client Failure',
  props<{ error: string }>()
);

/**
 * Change client status
 */
export const changeClientStatus = createAction(
  '[Clients] Change Client Status',
  props<{
    id: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  }>()
);

/**
 * Successfully changed client status
 */
export const changeClientStatusSuccess = createAction(
  '[Clients] Change Client Status Success',
  props<{ id: string }>()
);

/**
 * Failed to change client status
 */
export const changeClientStatusFailure = createAction(
  '[Clients] Change Client Status Failure',
  props<{ error: string }>()
);
