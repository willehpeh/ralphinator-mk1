import { DomainEvent } from '../base/domain-event';
import { TaskData } from '../value-objects/task-data.value-object';

/**
 * Domain event representing the creation of a new task.
 * This event is stored in the event store and used to rebuild the Task aggregate.
 */
export class TaskCreatedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly taskData: TaskData,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
