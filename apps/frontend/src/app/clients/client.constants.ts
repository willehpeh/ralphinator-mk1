import { ClientStatus, CLIENT_STATUS_VALUES } from '@angular-nest-starter/shared-types';

/**
 * Available client status values.
 * This is the single source of truth for available client statuses in the UI.
 */
export const CLIENT_STATUSES: readonly ClientStatus[] = CLIENT_STATUS_VALUES;

/**
 * Default client status used when creating new clients or resetting forms.
 */
export const DEFAULT_CLIENT_STATUS: ClientStatus = 'Active';

/**
 * Constant representing the "all clients" filter option.
 * Used in the client list component to indicate no status filtering is active.
 */
export const FILTER_ALL_CLIENTS = 'all' as const;
