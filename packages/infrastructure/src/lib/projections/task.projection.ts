import { EventsHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import {
  TaskCreatedDomainEvent,
  TaskDetailsUpdatedDomainEvent,
  TaskStatusChangedDomainEvent,
  TASK_EVENT_TYPES
} from '@angular-nest-starter/domain';
import {
  ITaskReadRepository,
  TaskReadModel,
  INJECTION_TOKENS,
} from '@angular-nest-starter/application';
import { BaseProjectionHandler } from '../base/base-projection.handler';

/**
 * TaskProjection
 *
 * Infrastructure layer projection that listens to task-related domain events
 * and builds optimized read models for the CQRS query side.
 *
 * This projection:
 * - Subscribes to TaskCreatedDomainEvent, TaskDetailsUpdatedDomainEvent, and TaskStatusChangedDomainEvent from the event store
 * - Transforms domain events into TaskReadModel DTOs
 * - Persists read models to the read repository (optimized for queries)
 * - Enables separation of write (event store) and read (read model) data stores
 * - Uses the event handler registry pattern for extensible event handling
 */
@Injectable()
@EventsHandler(TaskCreatedDomainEvent, TaskDetailsUpdatedDomainEvent, TaskStatusChangedDomainEvent)
export class TaskProjection extends BaseProjectionHandler {
  constructor(
    @Inject(INJECTION_TOKENS.TASK_READ_REPOSITORY)
    private readonly taskReadRepository: ITaskReadRepository
  ) {
    super();
    // Register event handlers for task events using helper method
    this.registerEventHandlers({
      [TASK_EVENT_TYPES.CREATED]: this.onTaskCreated.bind(this),
      [TASK_EVENT_TYPES.DETAILS_UPDATED]: this.onTaskDetailsUpdated.bind(this),
      [TASK_EVENT_TYPES.STATUS_CHANGED]: this.onTaskStatusChanged.bind(this),
    });
  }

  /**
   * Event handler for TaskCreatedDomainEvent
   * Creates a new task read model when a task is created
   */
  private async onTaskCreated(event: TaskCreatedDomainEvent): Promise<void> {
    // Transform TaskCreatedDomainEvent into task read model using helper
    const readModel = this.transformTaskDataToReadModel(
      event.aggregateId,
      event.taskData,
      event.occurredOn
    );

    // Persist to read repository
    await this.taskReadRepository.save(readModel);
  }

  /**
   * Helper method to transform TaskData and metadata into a TaskReadModel.
   * Eliminates duplication between create and update event handlers.
   *
   * @param aggregateId - The task aggregate ID
   * @param taskData - The task data from the domain event
   * @param createdAt - The timestamp when the task was created
   * @returns TaskReadModel for persistence
   */
  private transformTaskDataToReadModel(
    aggregateId: string,
    taskData: TaskCreatedDomainEvent['taskData'] | TaskDetailsUpdatedDomainEvent['taskData'],
    createdAt: Date
  ): TaskReadModel {
    return new TaskReadModel(
      aggregateId,
      taskData.title,
      taskData.status,
      taskData.priority,
      taskData.notes,
      taskData.deadline,
      taskData.clientId,
      taskData.projectId,
      createdAt
    );
  }

  /**
   * Event handler for TaskDetailsUpdatedDomainEvent
   * Updates the read model when task details change
   */
  private async onTaskDetailsUpdated(event: TaskDetailsUpdatedDomainEvent): Promise<void> {
    return this.updateReadModel(
      event.aggregateId,
      this.taskReadRepository,
      (existing) =>
        this.transformTaskDataToReadModel(
          event.aggregateId,
          event.taskData,
          existing?.createdAt ?? event.occurredOn // Preserve original createdAt
        )
    );
  }

  /**
   * Event handler for TaskStatusChangedDomainEvent
   * Updates only the status field in the read model when task status changes
   */
  private async onTaskStatusChanged(event: TaskStatusChangedDomainEvent): Promise<void> {
    return this.updateReadModel(
      event.aggregateId,
      this.taskReadRepository,
      (existing) => {
        if (!existing) {
          throw new Error(
            `Cannot update status: Task with ID ${event.aggregateId} not found in read model`
          );
        }
        // Create new read model with updated status, preserving all other fields
        return new TaskReadModel(
          existing.id,
          existing.title,
          event.newStatus, // Update status
          existing.priority,
          existing.notes,
          existing.deadline,
          existing.clientId,
          existing.projectId,
          existing.createdAt
        );
      }
    );
  }
}
