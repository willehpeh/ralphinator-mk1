import { ClientStatus } from './client.types';

/**
 * Available client status values.
 * This is the single source of truth for available client statuses in the UI.
 */
export const CLIENT_STATUSES: readonly ClientStatus[] = [
  'Active',
  'Inactive',
  'Prospect',
  'Past Client'
] as const;

/**
 * Default client status used when creating new clients or resetting forms.
 */
export const DEFAULT_CLIENT_STATUS: ClientStatus = 'Active';
