import { DomainEvent } from '../base/domain-event';

/**
 * Domain event representing the deletion of a task.
 * This event is stored in the event store and used to rebuild the Task aggregate.
 */
export class TaskDeletedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
