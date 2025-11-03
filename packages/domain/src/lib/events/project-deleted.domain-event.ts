import { DomainEvent } from '../base/domain-event';

/**
 * Domain event representing a project being marked as deleted (soft delete).
 * This event is stored in the event store and used to rebuild the Project aggregate.
 * The project remains in the event store but is removed from active views.
 */
export class ProjectDeletedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
