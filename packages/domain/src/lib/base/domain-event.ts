/**
 * Base class for all domain events in the system.
 * Domain events represent immutable facts that have happened in the domain.
 * They are stored in the event store and used to rebuild aggregate state.
 */
export abstract class DomainEvent {
  /**
   * Unique identifier for the aggregate this event belongs to
   */
  public readonly aggregateId: string;

  /**
   * The version of this event schema (for event versioning and evolution)
   */
  public readonly eventVersion: number;

  /**
   * Timestamp when the event occurred
   */
  public readonly occurredOn: Date;

  /**
   * Type of the event (derived from constructor name)
   */
  public readonly eventType: string;

  constructor(aggregateId: string, eventVersion = 1) {
    this.aggregateId = aggregateId;
    this.eventVersion = eventVersion;
    this.occurredOn = new Date();
    this.eventType = this.constructor.name;
  }
}
