/**
 * Constants for project domain event type names.
 * These must match the constructor names of the corresponding domain event classes.
 * Using constants prevents string mismatch bugs and improves maintainability.
 */
export const PROJECT_EVENT_TYPES = {
  CREATED: 'ProjectCreatedDomainEvent',
  DETAILS_UPDATED: 'ProjectDetailsUpdatedDomainEvent',
  STATUS_CHANGED: 'ProjectStatusChangedDomainEvent',
} as const;
