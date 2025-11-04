import { TaskStatus, TaskPriority } from '@angular-nest-starter/shared-types';

/**
 * Read model for task queries
 * Optimized DTO for read operations
 */
export class TaskReadModel {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly status: TaskStatus,
    public readonly priority: TaskPriority,
    public readonly notes: string | null,
    public readonly deadline: Date | null,
    public readonly clientId: string | null,
    public readonly projectId: string | null,
    public readonly createdAt: Date
  ) {}
}
