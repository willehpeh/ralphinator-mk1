import { DomainEvent } from '../base/domain-event';
import { ProjectStatus } from '@angular-nest-starter/shared-types';

/**
 * Domain event representing a change to a project's status.
 * This event is stored in the event store and used to rebuild the Project aggregate.
 */
export class ProjectStatusChangedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly previousStatus: ProjectStatus,
    public readonly newStatus: ProjectStatus,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
