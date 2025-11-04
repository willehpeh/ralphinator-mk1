/**
 * Task priority values array - single source of truth for all valid task priorities.
 * Used for both type definition and runtime validation (e.g., in DTOs).
 */
export const TASK_PRIORITY_VALUES = ['Low', 'Medium', 'High', 'Urgent'] as const;

/**
 * Task priority type representing all possible priority levels.
 * This is the single source of truth for task priority values across the application.
 */
export type TaskPriority = typeof TASK_PRIORITY_VALUES[number];
