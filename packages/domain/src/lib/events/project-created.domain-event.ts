import { DomainEvent } from '../base/domain-event';
import { ProjectData } from '../value-objects/project-data.value-object';

/**
 * Domain event representing the creation of a new project.
 * This event is stored in the event store and used to rebuild the Project aggregate.
 */
export class ProjectCreatedDomainEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly projectData: ProjectData,
    eventVersion = 1
  ) {
    super(aggregateId, eventVersion);
  }
}
