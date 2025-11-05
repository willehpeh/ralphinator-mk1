/**
 * Query to retrieve communications filtered by client ID.
 * Returns communications for a specific client sorted by most recent first.
 */
export class GetCommunicationsByClientIdQuery {
  constructor(public readonly clientId: string) {}
}
