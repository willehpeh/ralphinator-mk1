import { DomainEvent } from '@angular-nest-starter/domain';

/**
 * Port interface for event store implementation.
 * Infrastructure layer will provide the concrete implementation.
 */
export interface IEventStore {
  /**
   * Append domain events to the event stream for an aggregate.
   *
   * @param aggregateId - The unique identifier of the aggregate
   * @param events - Array of domain events to append
   * @param expectedVersion - Expected version for optimistic concurrency control
   *                          Use -1 for new aggregates, otherwise the last known version
   * @returns Promise that resolves when events are successfully persisted
   * @throws {ConcurrencyException} If expected version doesn't match actual version
   */
  appendEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void>;

  /**
   * Load all events for an aggregate from the event store.
   *
   * @param aggregateId - The unique identifier of the aggregate
   * @returns Array of domain events in order they were applied
   */
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
}
