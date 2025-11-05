import { CommunicationType } from '@angular-nest-starter/shared-types';

/**
 * Shared payload for communication data used by create and update commands.
 * Extracts the common properties to avoid duplication (DRY principle).
 */
export class CommunicationDataPayload {
  constructor(
    public readonly type: CommunicationType,
    public readonly subject: string,
    public readonly communicationDate: string,
    public readonly notes: string,
    public readonly clientId: string,
    public readonly contactId: string | null,
    public readonly projectId: string | null,
    public readonly followUpRequired: boolean,
    public readonly followUpDate: string | null
  ) {}
}
