import { DomainEvent } from '../base/domain-event';
import { TaskData } from '../value-objects/task-data.value-object';

/**
 * Domain event representing the update of task details.
 * This event is stored in the event store and used to rebuild the Task aggregate.
 *
 * Note: This event is for updating task details (title, notes, priority, deadline, etc.)
 * but NOT for changing the progress state (status). Status changes are handled separately.
 */
export class TaskDetailsUpdatedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly taskData: TaskData,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
