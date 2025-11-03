/**
 * Injection tokens for application layer ports.
 * These tokens are used for dependency injection of port implementations.
 * Using constants instead of string literals provides type safety and prevents typos.
 */
export const INJECTION_TOKENS = {
  AGGREGATE_REPOSITORY: 'IAggregateRepository',
  CLIENT_READ_REPOSITORY: 'IClientReadRepository',
  CONTACT_READ_REPOSITORY: 'IContactReadRepository',
  EVENT_STORE: 'IEventStore',
} as const;

/**
 * Type-safe token access.
 */
export type InjectionToken =
  (typeof INJECTION_TOKENS)[keyof typeof INJECTION_TOKENS];
