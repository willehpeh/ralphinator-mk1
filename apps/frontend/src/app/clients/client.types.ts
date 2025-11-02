/**
 * Client status type representing all possible client states.
 * This is duplicated from the domain layer to respect module boundaries.
 * Frontend can only depend on scope:frontend tagged packages.
 */
export type ClientStatus = 'Active' | 'Inactive' | 'Prospect' | 'Past Client';

/**
 * Client interface matching the backend ClientReadModel.
 * This is the single source of truth for the Client type in the frontend.
 */
export interface Client {
  id: string;
  companyName: string;
  email: string;
  phone: string | null;
  address: string | null;
  status: ClientStatus;
  notes: string | null;
  createdAt: string;
}
