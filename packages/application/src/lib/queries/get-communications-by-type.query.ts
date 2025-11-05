import { CommunicationType } from '@angular-nest-starter/shared-types';

/**
 * Query to retrieve communications filtered by communication type.
 * Returns communications of a specific type sorted by most recent first.
 */
export class GetCommunicationsByTypeQuery {
  constructor(public readonly type: CommunicationType) {}
}
