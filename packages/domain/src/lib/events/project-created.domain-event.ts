import { DomainEvent } from '../base/domain-event';
import { ProjectStatus } from '@angular-nest-starter/shared-types';

/**
 * Domain event representing the creation of a new project.
 * This event is stored in the event store and used to rebuild the Project aggregate.
 */
export class ProjectCreatedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly clientId: string,
    public readonly name: string,
    public readonly status: ProjectStatus,
    public readonly description: string | null,
    public readonly startDate: string | null,
    public readonly expectedEndDate: string | null,
    public readonly actualEndDate: string | null,
    public readonly budget: number | null,
    public readonly technicalNotes: string | null,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
