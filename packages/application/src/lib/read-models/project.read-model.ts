import { ProjectStatus } from '@angular-nest-starter/shared-types';

/**
 * Read model for project queries
 * Optimized DTO for read operations
 */
export class ProjectReadModel {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly name: string,
    public readonly status: ProjectStatus,
    public readonly description: string | null,
    public readonly startDate: Date | null,
    public readonly expectedEndDate: Date | null,
    public readonly actualEndDate: Date | null,
    public readonly budget: number | null,
    public readonly technicalNotes: string | null,
    public readonly createdAt: Date
  ) {}
}
