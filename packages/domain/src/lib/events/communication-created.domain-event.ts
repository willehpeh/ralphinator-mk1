import { DomainEvent } from '../base/domain-event';
import { CommunicationData } from '../value-objects/communication-data.value-object';

/**
 * Domain event representing the creation of a new communication.
 * This event is stored in the event store and used to rebuild the Communication aggregate.
 */
export class CommunicationCreatedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly communicationData: CommunicationData,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
