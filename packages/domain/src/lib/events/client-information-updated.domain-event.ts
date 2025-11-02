import { DomainEvent } from '../base/domain-event';
import { ClientStatus } from './client-created.domain-event';

/**
 * Domain event representing the update of client information.
 * This event is stored in the event store and used to rebuild the Client aggregate.
 */
export class ClientInformationUpdatedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly companyName: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly address: string | null,
    public readonly status: ClientStatus,
    public readonly notes: string | null,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
