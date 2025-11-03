import { DomainEvent } from '../base/domain-event';

/**
 * Domain event representing a contact's information being updated.
 * This event is stored in the event store and used to rebuild the Client aggregate.
 */
export class ContactUpdatedDomainEvent extends DomainEvent {
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
