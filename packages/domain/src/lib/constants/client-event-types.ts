/**
 * Constants for client domain event type names.
 * These must match the constructor names of the corresponding domain event classes.
 * Using constants prevents string mismatch bugs and improves maintainability.
 */
export const CLIENT_EVENT_TYPES = {
  CREATED: 'ClientCreatedDomainEvent',
  INFORMATION_UPDATED: 'ClientInformationUpdatedDomainEvent',
  STATUS_CHANGED: 'ClientStatusChangedDomainEvent',
  DELETED: 'ClientDeletedDomainEvent',
  CONTACT_ADDED: 'ContactAddedToClientDomainEvent',
  CONTACT_UPDATED: 'ContactUpdatedDomainEvent',
  CONTACT_DELETED: 'ContactDeletedDomainEvent',
} as const;
