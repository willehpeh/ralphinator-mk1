/**
 * Query to retrieve communications filtered by contact ID.
 * Returns communications for a specific contact sorted by most recent first.
 */
export class GetCommunicationsByContactIdQuery {
  constructor(public readonly contactId: string) {}
}
