import { ClientStatus } from '@angular-nest-starter/shared-types';

/**
 * Re-export ClientStatus from shared-types for convenience.
 * This allows frontend components to import from a local file while maintaining a single source of truth.
 */
export type { ClientStatus };

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

/**
 * Base Contact interface with core fields used across all contact views.
 * This is the single source of truth for Contact types in the frontend.
 */
export interface Contact {
  contactId: string;
  clientId: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
}

/**
 * Contact with additional timestamp metadata and client name.
 * Used in detail views where audit information is displayed.
 */
export interface ContactDetail extends Contact {
  clientName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contact with client context information.
 * Used in views that display contacts from multiple clients (e.g., all-contacts view).
 */
export interface ContactWithClient extends Contact {
  clientName: string;
}
