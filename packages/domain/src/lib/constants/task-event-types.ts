/**
 * Constants for task domain event type names.
 * These must match the constructor names of the corresponding domain event classes.
 * Using constants prevents string mismatch bugs and improves maintainability.
 */
export const TASK_EVENT_TYPES = {
  CREATED: 'TaskCreatedDomainEvent',
  DETAILS_UPDATED: 'TaskDetailsUpdatedDomainEvent',
} as const;
