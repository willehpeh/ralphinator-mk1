import { DomainEvent } from '../base/domain-event';

/**
 * Domain event representing the deletion of a client.
 * This event is stored in the event store and used to rebuild the Client aggregate.
 */
export class ClientDeletedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
