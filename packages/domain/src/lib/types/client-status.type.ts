/**
 * Client status values array - single source of truth for all valid client statuses.
 * Used for both type definition and runtime validation (e.g., in DTOs).
 */
export const CLIENT_STATUS_VALUES = ['Active', 'Inactive', 'Prospect', 'Past Client'] as const;

/**
 * Client status type representing all possible client states.
 * This is the single source of truth for client status values across the application.
 */
export type ClientStatus = typeof CLIENT_STATUS_VALUES[number];
