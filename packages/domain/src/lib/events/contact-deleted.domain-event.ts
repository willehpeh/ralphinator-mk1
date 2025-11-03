import { DomainEvent } from '../base/domain-event';

/**
 * Domain event representing a contact being deleted from a client.
 * This event is stored in the event store and used to rebuild the Client aggregate.
 */
export class ContactDeletedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly contactId: string,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
