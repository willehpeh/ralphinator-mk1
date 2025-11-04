import { TaskStatus, TaskPriority } from '@angular-nest-starter/shared-types';

/**
 * Shared payload for task data used by create and update commands.
 * Extracts the common properties to avoid duplication (DRY principle).
 */
export class TaskDataPayload {
  constructor(
    public readonly title: string,
    public readonly status: TaskStatus,
    public readonly priority: TaskPriority,
    public readonly notes: string | null,
    public readonly deadline: string | null,
    public readonly clientId: string | null,
    public readonly projectId: string | null
  ) {}
}
