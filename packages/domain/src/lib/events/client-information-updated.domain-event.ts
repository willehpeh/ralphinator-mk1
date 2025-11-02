import { DomainEvent } from '../base/domain-event';
import { ClientData } from '../value-objects/client-data.value-object';

/**
 * Domain event representing the update of client information.
 * This event is stored in the event store and used to rebuild the Client aggregate.
 */
export class ClientInformationUpdatedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly clientData: ClientData,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
