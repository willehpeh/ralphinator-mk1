/**
 * Task status values array - single source of truth for all valid task statuses.
 * Used for both type definition and runtime validation (e.g., in DTOs).
 */
export const TASK_STATUS_VALUES = ['Todo', 'InProgress', 'Completed', 'Cancelled'] as const;

/**
 * Task status type representing all possible task states.
 * This is the single source of truth for task status values across the application.
 */
export type TaskStatus = typeof TASK_STATUS_VALUES[number];
