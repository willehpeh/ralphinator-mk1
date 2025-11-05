/**
 * Query to retrieve communications filtered by project ID.
 * Returns communications for a specific project sorted by most recent first.
 */
export class GetCommunicationsByProjectIdQuery {
  constructor(public readonly projectId: string) {}
}
