import { DomainEvent } from './domain-event';

/**
 * Type for event handler functions that update aggregate state
 */
type EventHandler<TEvent extends DomainEvent> = (event: TEvent) => void;

/**
 * Base class for all event-sourced aggregates.
 * Aggregates rebuild their state by replaying domain events.
 * This ensures events are the single source of truth.
 *
 * Uses a Map-based event handler registry pattern for O(1) event dispatching,
 * eliminating the need for instanceof chains and improving extensibility.
 */
export abstract class EventSourcedAggregate {
  private uncommittedEvents: DomainEvent[] = [];
  private version = 0;
  private eventHandlers = new Map<string, EventHandler<DomainEvent>>();

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
   * Registers an event handler for a specific event type.
   * Child aggregates should call this in their constructor to register handlers.
   *
   * @param eventType - The event type name (usually the class name)
   * @param handler - The function to handle events of this type
   */
  protected registerEventHandler<TEvent extends DomainEvent>(
    eventType: string,
    handler: EventHandler<TEvent>
  ): void {
    this.eventHandlers.set(eventType, handler as EventHandler<DomainEvent>);
  }

  /**
   * Registers multiple event handlers at once using an event type to handler map.
   * This is a convenience method to reduce boilerplate when registering multiple handlers.
   *
   * @param handlers - Record mapping event types to their handler functions
   */
  protected registerEventHandlers<TEvent extends DomainEvent>(
    handlers: Record<string, EventHandler<TEvent>>
  ): void {
    Object.entries(handlers).forEach(([eventType, handler]) => {
      this.registerEventHandler(eventType, handler);
    });
  }

  /**
   * Applies an event by dispatching to the registered handler.
   * Uses Map lookup instead of instanceof chains for better performance and extensibility.
   *
   * @param event - The domain event to apply
   */
  protected apply(event: DomainEvent): void {
    const handler = this.eventHandlers.get(event.eventType);
    if (handler) {
      handler(event);
    }
    // Silent ignore if no handler registered - allows for forward compatibility
  }

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
