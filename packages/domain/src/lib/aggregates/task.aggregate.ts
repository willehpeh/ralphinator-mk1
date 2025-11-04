import { EventSourcedAggregate } from '../base/event-sourced-aggregate';
import { DomainEvent } from '../base/domain-event';
import { TaskStatus, TaskPriority } from '@angular-nest-starter/shared-types';
import { TASK_EVENT_TYPES } from '../constants/task-event-types';
import { DOMAIN_ERRORS } from '../constants/domain-errors';
import { TaskCreatedDomainEvent } from '../events/task-created.domain-event';
import { TaskDetailsUpdatedDomainEvent } from '../events/task-details-updated.domain-event';
import { TaskStatusChangedDomainEvent } from '../events/task-status-changed.domain-event';
import { TaskData } from '../value-objects/task-data.value-object';

export class TaskAggregate extends EventSourcedAggregate {
  private id?: string;
  private title?: string;
  private status?: TaskStatus;
  private priority?: TaskPriority;
  private notes: string | null = null;
  private deadline: Date | null = null;
  private clientId: string | null = null;
  private projectId: string | null = null;
  private completedAt: Date | null = null;

  constructor() {
    super();
    // Register event handlers for all task events
    // Type assertion needed because handlers have heterogeneous event types
    this.registerEventHandlers({
      [TASK_EVENT_TYPES.CREATED]: this.onTaskCreated.bind(this),
      [TASK_EVENT_TYPES.DETAILS_UPDATED]: this.onTaskDetailsUpdated.bind(this),
      [TASK_EVENT_TYPES.STATUS_CHANGED]: this.onTaskStatusChanged.bind(this),
    } as unknown as Record<string, (event: DomainEvent) => void>);
  }

  /**
   * Factory method to create a new Task aggregate
   *
   * @param id - Unique identifier for the task
   * @param taskData - Value object containing all task information
   * @returns A new TaskAggregate instance with TaskCreatedDomainEvent applied
   */
  static create(
    id: string,
    taskData: TaskData
  ): TaskAggregate {
    const task = new TaskAggregate();
    task.applyEvent(
      new TaskCreatedDomainEvent(id, taskData)
    );
    return task;
  }

  /**
   * Override base ensureInitialized to provide task-specific error message
   */
  protected override ensureInitialized(): string {
    if (!this.id) {
      throw new Error(DOMAIN_ERRORS.TASK_NOT_INITIALIZED);
    }
    return this.id;
  }

  /**
   * Helper method to update task fields from TaskData value object
   * Used by event handlers to apply state changes consistently
   *
   * @param taskData - Value object containing task information
   */
  private updateTaskFields(taskData: TaskData): void {
    this.title = taskData.title;
    this.status = taskData.status;
    this.priority = taskData.priority;
    this.notes = taskData.notes;
    this.deadline = taskData.deadline;
    this.clientId = taskData.clientId;
    this.projectId = taskData.projectId;
  }

  /**
   * Event handler for TaskCreatedDomainEvent
   * Initializes the aggregate state when a new task is created
   */
  private onTaskCreated(event: TaskCreatedDomainEvent): void {
    this.id = event.aggregateId;
    this.updateTaskFields(event.taskData);
  }

  /**
   * Event handler for TaskDetailsUpdatedDomainEvent
   * Updates the aggregate state when task details are modified
   */
  private onTaskDetailsUpdated(event: TaskDetailsUpdatedDomainEvent): void {
    this.updateTaskFields(event.taskData);
  }

  /**
   * Event handler for TaskStatusChangedDomainEvent
   * Updates the task status and completedAt timestamp
   */
  private onTaskStatusChanged(event: TaskStatusChangedDomainEvent): void {
    this.status = event.newStatus;
    this.completedAt = event.completedAt;
  }

  /**
   * Command method to update task details
   * Applies a TaskDetailsUpdatedDomainEvent to modify the task information
   *
   * @param taskData - Value object containing updated task information
   */
  updateDetails(taskData: TaskData): void {
    this.ensureInitialized();
    this.applyEvent(
      new TaskDetailsUpdatedDomainEvent(this.id!, taskData)
    );
  }

  /**
   * Command method to change task status
   * Applies a TaskStatusChangedDomainEvent to modify the task status.
   * When status changes to 'Completed', automatically records the completion timestamp.
   *
   * @param newStatus - The new status for the task
   */
  changeStatus(newStatus: TaskStatus): void {
    this.ensureInitialized();

    // Automatically set completedAt when status becomes 'Completed'
    const completedAt = newStatus === 'Completed' ? new Date() : null;

    this.applyEvent(
      new TaskStatusChangedDomainEvent(this.id!, newStatus, completedAt)
    );
  }

  // Getters for accessing aggregate state
  // All getters ensure the aggregate is initialized before returning values
  getId(): string {
    return this.ensureInitialized();
  }

  getTitle(): string {
    return this.getInitializedField(this.title);
  }

  getStatus(): TaskStatus {
    return this.getInitializedField(this.status);
  }

  getPriority(): TaskPriority {
    return this.getInitializedField(this.priority);
  }

  getNotes(): string | null {
    return this.getInitializedField(this.notes);
  }

  getDeadline(): Date | null {
    return this.getInitializedField(this.deadline);
  }

  getClientId(): string | null {
    return this.getInitializedField(this.clientId);
  }

  getProjectId(): string | null {
    return this.getInitializedField(this.projectId);
  }

  getCompletedAt(): Date | null {
    return this.getInitializedField(this.completedAt);
  }
}
