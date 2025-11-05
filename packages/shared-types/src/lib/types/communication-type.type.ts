/**
 * Communication type values array - single source of truth for all valid communication types.
 * Used for both type definition and runtime validation (e.g., in DTOs).
 */
export const COMMUNICATION_TYPE_VALUES = ['Call', 'Email', 'Meeting', 'Chat', 'Other'] as const;

/**
 * Communication type representing all possible types of client interactions.
 * This is the single source of truth for communication type values across the application.
 */
export type CommunicationType = typeof COMMUNICATION_TYPE_VALUES[number];
