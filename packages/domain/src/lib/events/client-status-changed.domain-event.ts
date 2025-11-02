import { DomainEvent } from '../base/domain-event';
import { ClientStatus } from './client-created.domain-event';

/**
 * Domain event representing a change to a client's status.
 * This event is stored in the event store and used to rebuild the Client aggregate.
 */
export class ClientStatusChangedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly previousStatus: ClientStatus,
    public readonly newStatus: ClientStatus,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
