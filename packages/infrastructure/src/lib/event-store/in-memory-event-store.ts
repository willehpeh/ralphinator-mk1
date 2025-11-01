import { Injectable } from '@nestjs/common';
import { DomainEvent } from '@angular-nest-starter/domain';
import { IEventStore } from '@angular-nest-starter/application';

/**
 * In-memory implementation of IEventStore for development and testing.
 *
 * This implementation stores events in memory using a Map. It provides:
 * - Event persistence by aggregate ID
 * - Optimistic concurrency control via version checking
 * - Event retrieval in order of persistence
 *
 * WARNING: This implementation loses all data when the process restarts.
 * For production use, implement a persistent event store (PostgreSQL, EventStoreDB, etc.)
 */
@Injectable()
export class InMemoryEventStore implements IEventStore {
  // Map of aggregateId -> array of events
  private readonly events = new Map<string, DomainEvent[]>();

  /**
   * Append domain events to the event stream for an aggregate.
   *
   * @param aggregateId - The unique identifier of the aggregate
   * @param events - Array of domain events to append
   * @param expectedVersion - Expected version for optimistic concurrency control
   *                          Use -1 for new aggregates, otherwise the last known version
   * @throws {Error} If expected version doesn't match actual version (concurrency conflict)
   */
  async appendEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void> {
    // Get existing events for this aggregate
    const existingEvents = this.events.get(aggregateId) || [];

    // Calculate actual version (number of existing events, 0-indexed so -1 means no events)
    const actualVersion = existingEvents.length - 1;

    // Optimistic concurrency check
    if (actualVersion !== expectedVersion) {
      throw new Error(
        `Concurrency conflict for aggregate ${aggregateId}: expected version ${expectedVersion}, actual version ${actualVersion}`
      );
    }

    // Append new events
    const updatedEvents = [...existingEvents, ...events];
    this.events.set(aggregateId, updatedEvents);
  }

  /**
   * Load all events for an aggregate from the event store.
   *
   * @param aggregateId - The unique identifier of the aggregate
   * @returns Array of domain events in order they were applied
   */
  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    return this.events.get(aggregateId) || [];
  }
}
