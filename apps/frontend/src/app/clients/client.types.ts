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
