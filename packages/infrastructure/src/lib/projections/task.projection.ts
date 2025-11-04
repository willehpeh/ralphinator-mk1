import { EventsHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import {
  TaskCreatedDomainEvent,
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
 * - Subscribes to TaskCreatedDomainEvent from the event store
 * - Transforms domain events into TaskReadModel DTOs
 * - Persists read models to the read repository (optimized for queries)
 * - Enables separation of write (event store) and read (read model) data stores
 * - Uses the event handler registry pattern for extensible event handling
 */
@Injectable()
@EventsHandler(TaskCreatedDomainEvent)
export class TaskProjection extends BaseProjectionHandler {
  constructor(
    @Inject(INJECTION_TOKENS.TASK_READ_REPOSITORY)
    private readonly taskReadRepository: ITaskReadRepository
  ) {
    super();
    // Register event handler for task created event using helper method
    this.registerEventHandlers({
      [TASK_EVENT_TYPES.CREATED]: this.onTaskCreated.bind(this),
    });
  }

  /**
   * Event handler for TaskCreatedDomainEvent
   * Creates a new task read model when a task is created
   */
  private async onTaskCreated(event: TaskCreatedDomainEvent): Promise<void> {
    // Transform TaskCreatedDomainEvent into task read model
    const readModel = new TaskReadModel(
      event.aggregateId, // taskId
      event.taskData.title,
      event.taskData.status,
      event.taskData.priority,
      event.taskData.notes,
      event.taskData.deadline,
      event.taskData.clientId,
      event.taskData.projectId,
      event.occurredOn // createdAt timestamp from event
    );

    // Persist to read repository
    await this.taskReadRepository.save(readModel);
  }
}
