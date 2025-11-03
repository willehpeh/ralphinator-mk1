import { EventsHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import {
  ProjectCreatedDomainEvent,
  ProjectDetailsUpdatedDomainEvent,
  ProjectStatusChangedDomainEvent,
  ProjectDeletedDomainEvent,
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
 * - Subscribes to ProjectCreatedDomainEvent and ProjectDetailsUpdatedDomainEvent from the event store
 * - Transforms domain events into ProjectReadModel DTOs
 * - Persists read models to the read repository (optimized for queries)
 * - Enables separation of write (event store) and read (read model) data stores
 * - Uses the event handler registry pattern for extensible event handling
 */
@Injectable()
@EventsHandler(ProjectCreatedDomainEvent, ProjectDetailsUpdatedDomainEvent, ProjectStatusChangedDomainEvent, ProjectDeletedDomainEvent)
export class ProjectProjection extends BaseProjectionHandler {
  constructor(
    @Inject(INJECTION_TOKENS.PROJECT_READ_REPOSITORY)
    private readonly projectReadRepository: IProjectReadRepository
  ) {
    super();
    // Register event handlers for project events using helper method
    this.registerEventHandlers({
      [PROJECT_EVENT_TYPES.CREATED]: this.onProjectCreated.bind(this),
      [PROJECT_EVENT_TYPES.DETAILS_UPDATED]: this.onProjectDetailsUpdated.bind(this),
      [PROJECT_EVENT_TYPES.STATUS_CHANGED]: this.onProjectStatusChanged.bind(this),
      [PROJECT_EVENT_TYPES.DELETED]: this.onProjectDeleted.bind(this),
    });
  }

  /**
   * Event handler for ProjectCreatedDomainEvent
   * Creates a new read model when a project is created
   */
  private async onProjectCreated(event: ProjectCreatedDomainEvent): Promise<void> {
    // Transform ProjectCreatedDomainEvent into read model using helper
    const readModel = this.transformProjectDataToReadModel(
      event.aggregateId,
      event.projectData,
      event.occurredOn
    );

    // Persist to read repository
    await this.projectReadRepository.save(readModel);
  }

  /**
   * Helper method to update an existing read model.
   * Fetches the existing read model, applies the update function, and saves it.
   * Consolidates the common "fetch-update-save" pattern across event handlers.
   *
   * @param aggregateId - The project aggregate ID
   * @param updater - Function that transforms the existing read model into the updated version
   */
  private async updateReadModel(
    aggregateId: string,
    updater: (existing: ProjectReadModel | null) => ProjectReadModel | null
  ): Promise<void> {
    const existing = await this.projectReadRepository.findById(aggregateId);
    const updated = updater(existing);

    if (updated) {
      await this.projectReadRepository.save(updated);
    }
  }

  /**
   * Helper method to transform ProjectData and metadata into a ProjectReadModel.
   * Eliminates duplication between create and update event handlers.
   *
   * @param aggregateId - The project aggregate ID
   * @param projectData - The project data from the domain event
   * @param createdAt - The timestamp when the project was created
   * @returns ProjectReadModel for persistence
   */
  private transformProjectDataToReadModel(
    aggregateId: string,
    projectData: ProjectCreatedDomainEvent['projectData'] | ProjectDetailsUpdatedDomainEvent['projectData'],
    createdAt: Date
  ): ProjectReadModel {
    return new ProjectReadModel(
      aggregateId,
      projectData.clientId,
      projectData.name,
      projectData.status,
      projectData.description,
      projectData.startDate,
      projectData.expectedEndDate,
      projectData.actualEndDate,
      projectData.budget,
      projectData.technicalNotes,
      createdAt
    );
  }

  /**
   * Event handler for ProjectDetailsUpdatedDomainEvent
   * Updates the read model when project details change
   */
  private async onProjectDetailsUpdated(event: ProjectDetailsUpdatedDomainEvent): Promise<void> {
    return this.updateReadModel(event.aggregateId, (existing) =>
      this.transformProjectDataToReadModel(
        event.aggregateId,
        event.projectData,
        existing?.createdAt ?? event.occurredOn // Preserve original createdAt
      )
    );
  }

  /**
   * Event handler for ProjectStatusChangedDomainEvent
   * Updates only the status field in the read model when project status changes.
   * This is more efficient than updating all fields since only status has changed.
   */
  private async onProjectStatusChanged(event: ProjectStatusChangedDomainEvent): Promise<void> {
    return this.updateReadModel(event.aggregateId, (existing) => {
      if (!existing) {
        return null; // Cannot update status if project doesn't exist
      }

      // Create new read model with updated status, preserving all other fields
      return new ProjectReadModel(
        existing.id,
        existing.clientId,
        existing.name,
        event.newStatus, // Only update the status field
        existing.description,
        existing.startDate,
        existing.expectedEndDate,
        existing.actualEndDate,
        existing.budget,
        existing.technicalNotes,
        existing.createdAt
      );
    });
  }

  /**
   * Event handler for ProjectDeletedDomainEvent
   * Removes the project from the read model when a project is deleted (soft delete).
   * The project remains in the event store for audit trail purposes.
   */
  private async onProjectDeleted(event: ProjectDeletedDomainEvent): Promise<void> {
    await this.projectReadRepository.delete(event.aggregateId);
  }
}
