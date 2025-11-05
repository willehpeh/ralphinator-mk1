import { CommunicationType } from '@angular-nest-starter/shared-types';

/**
 * Value object encapsulating communication information.
 * Used to reduce parameter duplication across domain events and aggregates.
 */
export class CommunicationData {
  constructor(
    public readonly type: CommunicationType,
    public readonly subject: string,
    public readonly communicationDate: Date,
    public readonly notes: string,
    public readonly clientId: string,
    public readonly contactId: string | null,
    public readonly projectId: string | null,
    public readonly followUpRequired: boolean,
    public readonly followUpDate: Date | null
  ) {}

  /**
   * Factory method to create CommunicationData from payload objects.
   * Reduces duplication in command handlers.
   * Converts string dates to Date objects.
   *
   * @param payload - Object containing communication data properties
   * @returns New CommunicationData instance
   */
  static fromPayload(payload: {
    type: CommunicationType;
    subject: string;
    communicationDate: string | Date;
    notes: string;
    clientId: string;
    contactId?: string | null;
    projectId?: string | null;
    followUpRequired: boolean;
    followUpDate?: string | Date | null;
  }): CommunicationData {
    return new CommunicationData(
      payload.type,
      payload.subject,
      typeof payload.communicationDate === 'string'
        ? new Date(payload.communicationDate)
        : payload.communicationDate,
      payload.notes,
      payload.clientId,
      payload.contactId ?? null,
      payload.projectId ?? null,
      payload.followUpRequired,
      payload.followUpDate
        ? (typeof payload.followUpDate === 'string'
            ? new Date(payload.followUpDate)
            : payload.followUpDate)
        : null
    );
  }
}
