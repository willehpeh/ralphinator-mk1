import { ProjectStatus } from '@angular-nest-starter/shared-types';

/**
 * Value object encapsulating project information.
 * Used to reduce parameter duplication across domain events and aggregates.
 */
export class ProjectData {
  constructor(
    public readonly clientId: string,
    public readonly name: string,
    public readonly status: ProjectStatus,
    public readonly description: string | null,
    public readonly startDate: Date | null,
    public readonly expectedEndDate: Date | null,
    public readonly actualEndDate: Date | null,
    public readonly budget: number | null,
    public readonly technicalNotes: string | null
  ) {}

  /**
   * Factory method to create ProjectData from payload objects.
   * Reduces duplication in command handlers.
   * Converts string dates to Date objects.
   *
   * @param payload - Object containing project data properties
   * @returns New ProjectData instance
   */
  static fromPayload(payload: {
    clientId: string;
    name: string;
    status: ProjectStatus;
    description?: string | null;
    startDate?: string | Date | null;
    expectedEndDate?: string | Date | null;
    actualEndDate?: string | Date | null;
    budget?: number | null;
    technicalNotes?: string | null;
  }): ProjectData {
    return new ProjectData(
      payload.clientId,
      payload.name,
      payload.status,
      payload.description ?? null,
      payload.startDate ? (typeof payload.startDate === 'string' ? new Date(payload.startDate) : payload.startDate) : null,
      payload.expectedEndDate ? (typeof payload.expectedEndDate === 'string' ? new Date(payload.expectedEndDate) : payload.expectedEndDate) : null,
      payload.actualEndDate ? (typeof payload.actualEndDate === 'string' ? new Date(payload.actualEndDate) : payload.actualEndDate) : null,
      payload.budget ?? null,
      payload.technicalNotes ?? null
    );
  }
}
