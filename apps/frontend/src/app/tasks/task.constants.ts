import { TaskStatus, TaskPriority, TASK_STATUS_VALUES, TASK_PRIORITY_VALUES } from '@angular-nest-starter/shared-types';

/**
 * Available task status values.
 * This is the single source of truth for available task statuses in the UI.
 */
export const TASK_STATUSES: readonly TaskStatus[] = TASK_STATUS_VALUES;

/**
 * Available task priority values.
 * This is the single source of truth for available task priorities in the UI.
 */
export const TASK_PRIORITIES: readonly TaskPriority[] = TASK_PRIORITY_VALUES;

/**
 * Default task status used when creating new tasks or resetting forms.
 */
export const DEFAULT_TASK_STATUS: TaskStatus = 'Todo';

/**
 * Default task priority used when creating new tasks or resetting forms.
 */
export const DEFAULT_TASK_PRIORITY: TaskPriority = 'Medium';

/**
 * Constant representing the "all tasks" filter option.
 * Used in the task list component to indicate no status filtering is active.
 */
export const FILTER_ALL_TASKS = 'all' as const;
