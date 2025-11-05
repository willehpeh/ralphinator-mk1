/**
 * Constants for communication domain event type names.
 * These must match the constructor names of the corresponding domain event classes.
 * Using constants prevents string mismatch bugs and improves maintainability.
 */
export const COMMUNICATION_EVENT_TYPES = {
  CREATED: 'CommunicationCreatedDomainEvent',
} as const;
