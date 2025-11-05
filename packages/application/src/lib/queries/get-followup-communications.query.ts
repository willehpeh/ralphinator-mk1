import { IQuery } from '@nestjs/cqrs';

/**
 * Query to retrieve communications requiring follow-up for the dashboard.
 * Returns all communications with requiresFollowUp=true where follow-up is not yet completed,
 * sorted by follow-up date (earliest first).
 */
export class GetFollowUpCommunicationsQuery implements IQuery {
  constructor() {}
}
