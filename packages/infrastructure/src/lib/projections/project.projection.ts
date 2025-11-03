import { EventsHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import {
  ProjectCreatedDomainEvent,
  PROJECT_EVENT_TYPES,
} from '@angular-nest-starter/domain';
import {
  IProjectReadRepository,
  ProjectReadModel,
  INJECTION_TOKENS,
} from '@angular-nest-starter/application';
import { BaseProjectionHandler } from '../base/base-projection.handler';

/**
 * ProjectProjection
 *
 * Infrastructure layer projection that listens to domain events and builds
 * optimized read models for the CQRS query side.
 *
 * This projection:
 * - Subscribes to ProjectCreatedDomainEvent from the event store
 * - Transforms domain events into ProjectReadModel DTOs
 * - Persists read models to the read repository (optimized for queries)
 * - Enables separation of write (event store) and read (read model) data stores
 * - Uses the event handler registry pattern for extensible event handling
 */
@Injectable()
@EventsHandler(ProjectCreatedDomainEvent)
export class ProjectProjection extends BaseProjectionHandler {
  constructor(
    @Inject(INJECTION_TOKENS.PROJECT_READ_REPOSITORY)
    private readonly projectReadRepository: IProjectReadRepository
  ) {
    super();
    // Register event handler for project created event using helper method
    this.registerEventHandlers({
      [PROJECT_EVENT_TYPES.CREATED]: this.onProjectCreated.bind(this),
    });
  }

  /**
   * Helper method to transform ProjectCreatedDomainEvent into a ProjectReadModel.
   * Converts string dates from event to Date objects for the read model.
   *
   * @param event - The ProjectCreatedDomainEvent
   * @returns ProjectReadModel for persistence
   */
  private transformToReadModel(event: ProjectCreatedDomainEvent): ProjectReadModel {
    return new ProjectReadModel(
      event.aggregateId,
      event.clientId,
      event.name,
      event.status,
      event.description,
      event.startDate ? new Date(event.startDate) : null,
      event.expectedEndDate ? new Date(event.expectedEndDate) : null,
      event.actualEndDate ? new Date(event.actualEndDate) : null,
      event.budget,
      event.technicalNotes,
      event.occurredOn
    );
  }

  /**
   * Event handler for ProjectCreatedDomainEvent
   * Creates a new read model when a project is created
   */
  private async onProjectCreated(event: ProjectCreatedDomainEvent): Promise<void> {
    // Transform ProjectCreatedDomainEvent into read model using helper
    const readModel = this.transformToReadModel(event);

    // Persist to read repository
    await this.projectReadRepository.save(readModel);
  }
}
