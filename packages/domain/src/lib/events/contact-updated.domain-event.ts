import { DomainEvent } from '../base/domain-event';
import { ContactData } from '../value-objects/contact-data.value-object';

/**
 * Domain event representing a contact's information being updated.
 * This event is stored in the event store and used to rebuild the Client aggregate.
 */
export class ContactUpdatedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly contactData: ContactData,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
