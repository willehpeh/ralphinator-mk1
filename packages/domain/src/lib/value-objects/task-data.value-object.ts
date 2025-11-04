import { TaskStatus, TaskPriority } from '@angular-nest-starter/shared-types';

/**
 * Value object encapsulating task information.
 * Used to reduce parameter duplication across domain events and aggregates.
 */
export class TaskData {
  constructor(
    public readonly title: string,
    public readonly status: TaskStatus,
    public readonly priority: TaskPriority,
    public readonly notes: string | null,
    public readonly deadline: Date | null,
    public readonly clientId: string | null,
    public readonly projectId: string | null
  ) {}

  /**
   * Factory method to create TaskData from payload objects.
   * Reduces duplication in command handlers.
   * Converts string dates to Date objects.
   *
   * @param payload - Object containing task data properties
   * @returns New TaskData instance
   */
  static fromPayload(payload: {
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    notes?: string | null;
    deadline?: string | Date | null;
    clientId?: string | null;
    projectId?: string | null;
  }): TaskData {
    return new TaskData(
      payload.title,
      payload.status,
      payload.priority,
      payload.notes ?? null,
      payload.deadline ? (typeof payload.deadline === 'string' ? new Date(payload.deadline) : payload.deadline) : null,
      payload.clientId ?? null,
      payload.projectId ?? null
    );
  }
}
