import { DomainEvent } from '../base/domain-event';
import { ClientData } from '../value-objects/client-data.value-object';

/**
 * Domain event representing the creation of a new client.
 * This event is stored in the event store and used to rebuild the Client aggregate.
 */
export class ClientCreatedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly clientData: ClientData,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
