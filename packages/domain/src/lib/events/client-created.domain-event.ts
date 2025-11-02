import { DomainEvent } from '../base/domain-event';
import { ClientStatus } from '../types/client-status.type';

/**
 * Domain event representing the creation of a new client.
 * This event is stored in the event store and used to rebuild the Client aggregate.
 */
export class ClientCreatedDomainEvent extends DomainEvent {
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
