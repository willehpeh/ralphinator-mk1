import { ClientStatus } from '@angular-nest-starter/domain';

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
