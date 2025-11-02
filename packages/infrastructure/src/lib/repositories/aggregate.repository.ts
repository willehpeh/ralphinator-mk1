import { Injectable, Inject } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventSourcedAggregate } from '@angular-nest-starter/domain';
import { IAggregateRepository, IEventStore } from '@angular-nest-starter/application';

/**
 * Infrastructure implementation of the aggregate repository pattern.
 * Provides event sourcing capabilities: loading aggregates by replaying events
 * and persisting new events to the event store.
 */
@Injectable()
export class AggregateRepository<T extends EventSourcedAggregate> implements IAggregateRepository<T> {
  constructor(
    @Inject('IEventStore') private readonly eventStore: IEventStore,
    private readonly eventBus: EventBus
  ) {}

  /**
   * Loads an aggregate by replaying all events from the event store
   */
  async load(aggregateId: string, aggregateType: new () => T): Promise<T> {
    const events = await this.eventStore.getEvents(aggregateId);
    const aggregate = new aggregateType();
    aggregate.loadFromHistory(events);
    return aggregate;
  }

  /**
   * Persists uncommitted events to the event store and publishes them to the event bus
   */
  async save(aggregate: T): Promise<void> {
    const uncommittedEvents = aggregate.getUncommittedEvents();
    if (uncommittedEvents.length === 0) {
      return;
    }

    // Get current version for optimistic concurrency control
    // Version before applying new events is: currentVersion - uncommittedEvents.length
    const currentVersion = aggregate.getVersion() - uncommittedEvents.length;

    await this.eventStore.appendEvents(
      aggregate.getId(),
      uncommittedEvents,
      currentVersion
    );

    // Publish integration events for side effects
    uncommittedEvents.forEach(event => this.eventBus.publish(event));

    aggregate.markEventsAsCommitted();
  }
}
