import { DomainEvent } from '../base/domain-event';

/**
 * Domain event representing a contact being added to a client.
 * This event is stored in the event store and used to rebuild the Client aggregate.
 */
export class ContactAddedToClientDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly contactId: string,
    public readonly name: string,
    public readonly role: string | null,
    public readonly email: string | null,
    public readonly phone: string | null,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
