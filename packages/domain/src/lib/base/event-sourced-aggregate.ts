import { DomainEvent } from './domain-event';

/**
 * Base class for all event-sourced aggregates.
 * Aggregates rebuild their state by replaying domain events.
 * This ensures events are the single source of truth.
 */
export abstract class EventSourcedAggregate {
  private uncommittedEvents: DomainEvent[] = [];
  private version = 0;

  /**
   * Gets the aggregate's unique identifier.
   * Must be implemented by child aggregates.
   */
  abstract getId(): string;

  /**
   * Gets the aggregate's current version.
   * Used for optimistic concurrency control.
   */
  getVersion(): number {
    return this.version;
  }

  /**
   * Gets all uncommitted events that need to be persisted.
   */
  getUncommittedEvents(): DomainEvent[] {
    return this.uncommittedEvents;
  }

  /**
   * Marks all uncommitted events as committed.
   * Called after events are successfully persisted to the event store.
   */
  markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }

  /**
   * Loads the aggregate from historical events.
   * Used when rebuilding aggregate state from the event store.
   */
  loadFromHistory(events: DomainEvent[]): void {
    events.forEach((event) => {
      this.applyChange(event, false);
    });
  }

  /**
   * Applies a new event to the aggregate.
   * Adds to uncommitted events and updates state.
   */
  protected applyEvent(event: DomainEvent): void {
    this.applyChange(event, true);
  }

  /**
   * Abstract method that child aggregates must implement.
   * Defines how each event type updates the aggregate's state.
   */
  protected abstract apply(event: DomainEvent): void;

  /**
   * Internal method to apply event and manage versioning.
   */
  private applyChange(event: DomainEvent, isNew: boolean): void {
    this.apply(event);
    if (isNew) {
      this.uncommittedEvents.push(event);
    }
    this.version++;
  }
}
