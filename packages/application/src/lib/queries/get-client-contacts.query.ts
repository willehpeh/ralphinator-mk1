/**
 * Query to retrieve all contacts associated with a specific client.
 */
export class GetClientContactsQuery {
  constructor(public readonly clientId: string) {}
}
