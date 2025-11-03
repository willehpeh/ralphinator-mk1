/**
 * Project status values array - single source of truth for all valid project statuses.
 * Used for both type definition and runtime validation (e.g., in DTOs).
 */
export const PROJECT_STATUS_VALUES = ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'] as const;

/**
 * Project status type representing all possible project states.
 * This is the single source of truth for project status values across the application.
 */
export type ProjectStatus = typeof PROJECT_STATUS_VALUES[number];
