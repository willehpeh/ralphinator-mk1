import { IQuery } from '@nestjs/cqrs';

/**
 * Query to retrieve recent communications for the dashboard.
 * Returns the last 10 communications sorted by date (newest first).
 */
export class GetRecentCommunicationsQuery implements IQuery {
  constructor(public readonly limit = 10) {}
}
