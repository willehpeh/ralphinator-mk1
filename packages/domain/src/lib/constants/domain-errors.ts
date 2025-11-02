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
   * Error message when client status property is unexpectedly undefined
   */
  CLIENT_STATUS_NOT_INITIALIZED: 'Client status is not initialized',

  /**
   * Error message when attempting to change status to the same value
   */
  CLIENT_STATUS_UNCHANGED: 'New status must be different from current status',
} as const;
