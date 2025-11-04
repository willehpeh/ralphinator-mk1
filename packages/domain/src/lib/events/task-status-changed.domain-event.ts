import { DomainEvent } from '../base/domain-event';
import { TaskStatus } from '@angular-nest-starter/shared-types';

/**
 * Domain event representing a task status change.
 * This event is stored in the event store and used to rebuild the Task aggregate.
 * When status changes to 'Completed', the completedAt timestamp is recorded.
 */
export class TaskStatusChangedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly newStatus: TaskStatus,
    public readonly completedAt: Date | null,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
