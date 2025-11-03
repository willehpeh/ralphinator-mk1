import { ProjectStatus } from '@angular-nest-starter/shared-types';

/**
 * Shared payload for project data used by create and update commands.
 * Extracts the common properties to avoid duplication (DRY principle).
 */
export class ProjectDataPayload {
  constructor(
    public readonly clientId: string,
    public readonly name: string,
    public readonly status: ProjectStatus,
    public readonly description: string | null,
    public readonly startDate: string | null,
    public readonly expectedEndDate: string | null,
    public readonly actualEndDate: string | null,
    public readonly budget: number | null,
    public readonly technicalNotes: string | null
  ) {}
}
