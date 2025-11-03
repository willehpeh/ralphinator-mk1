import { EventSourcedAggregate } from '@angular-nest-starter/domain';

/**
 * Port interface for loading and persisting event-sourced aggregates.
 * Provides abstraction over event store operations following Clean Architecture principles.
 */
export interface IAggregateRepository<T extends EventSourcedAggregate> {
  /**
   * Loads an aggregate by replaying events from the event store
   * @param aggregateId - The unique identifier of the aggregate
   * @param aggregateType - Constructor function for the aggregate type
   * @returns The reconstructed aggregate with replayed events
   * @throws Error if aggregate not found or events cannot be loaded
   */
  load<U extends EventSourcedAggregate>(aggregateId: string, aggregateType: new () => U): Promise<U>;

  /**
   * Persists uncommitted events from an aggregate to the event store
   * @param aggregate - The aggregate with uncommitted events to persist
   * @throws Error if events cannot be persisted
   */
  save(aggregate: T): Promise<void>;
}
