import { IEventHandler } from '@nestjs/cqrs';
import { DomainEvent } from '@angular-nest-starter/domain';

/**
 * Type for projection event handler functions that update read models
 */
type ProjectionEventHandler<TEvent extends DomainEvent> = (event: TEvent) => Promise<void>;

/**
 * Base class for projections that build read models from domain events.
 * Uses a Map-based event handler registry pattern for O(1) event dispatching,
 * eliminating the need for instanceof chains and improving extensibility.
 *
 * Child projections should:
 * 1. Call super() in constructor
 * 2. Register event handlers using registerEventHandler()
 * 3. Implement handler methods that update read models
 */
export abstract class BaseProjectionHandler implements IEventHandler<DomainEvent> {
  private eventHandlers = new Map<string, ProjectionEventHandler<DomainEvent>>();

  /**
   * Registers an event handler for a specific event type.
   * Child projections should call this in their constructor to register handlers.
   *
   * @param eventType - The event type name (usually the class name)
   * @param handler - The async function to handle events of this type
   */
  protected registerEventHandler<TEvent extends DomainEvent>(
    eventType: string,
    handler: ProjectionEventHandler<TEvent>
  ): void {
    this.eventHandlers.set(eventType, handler as ProjectionEventHandler<DomainEvent>);
  }

  /**
   * Registers multiple event handlers at once using an event type to handler map.
   * This is a convenience method to reduce boilerplate when registering multiple handlers.
   *
   * @param handlers - Record mapping event types to their handler functions
   */
  protected registerEventHandlers<TEvent extends DomainEvent>(
    handlers: Record<string, ProjectionEventHandler<TEvent>>
  ): void {
    Object.entries(handlers).forEach(([eventType, handler]) => {
      this.registerEventHandler(eventType, handler);
    });
  }

  /**
   * Handles domain events by dispatching to the registered handler.
   * Uses Map lookup instead of instanceof chains for better performance and extensibility.
   *
   * @param event - The domain event from the event store
   */
  async handle(event: DomainEvent): Promise<void> {
    const handler = this.eventHandlers.get(event.eventType);
    if (handler) {
      await handler(event);
    }
    // Silent ignore if no handler registered - allows for forward compatibility
  }
}
