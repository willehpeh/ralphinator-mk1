import { CommunicationType } from '@angular-nest-starter/shared-types';

/**
 * Read model for communication queries
 * Optimized DTO for read operations with denormalized data
 */
export class CommunicationReadModel {
  constructor(
    public readonly id: string,
    public readonly type: CommunicationType,
    public readonly subject: string,
    public readonly communicationDate: Date,
    public readonly duration: number | null,
    public readonly notes: string,
    public readonly clientId: string,
    public readonly clientName: string,
    public readonly contactId: string | null,
    public readonly contactName: string | null,
    public readonly projectId: string | null,
    public readonly projectName: string | null,
    public readonly followUpRequired: boolean,
    public readonly followUpDate: Date | null,
    public readonly followUpCompleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
