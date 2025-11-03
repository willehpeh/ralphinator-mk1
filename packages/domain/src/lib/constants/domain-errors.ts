/**
 * Domain Error Messages
 *
 * Centralized error messages for domain layer validation and business rule enforcement.
 * These messages are used by aggregates and domain services.
 */
export const DOMAIN_ERRORS = {
  /**
   * Error message when attempting to perform an operation on an aggregate
   * that has not been initialized (created) yet
   */
  CLIENT_NOT_INITIALIZED: 'Cannot perform operation on a client that has not been created',

  /**
   * Error message when attempting to change status to the same value
   */
  CLIENT_STATUS_UNCHANGED: 'New status must be different from current status',

  /**
   * Error message when email format is invalid
   */
  INVALID_EMAIL_FORMAT: 'Invalid email format',

  /**
   * Error message when attempting to update a contact that does not exist
   */
  CONTACT_NOT_FOUND: 'Contact not found',

  /**
   * Error message when attempting to perform an operation on an aggregate
   * that has not been initialized (created) yet
   */
  PROJECT_NOT_INITIALIZED: 'Cannot perform operation on a project that has not been created',
} as const;
