/**
 * Query to retrieve all projects associated with a specific client.
 */
export class GetProjectsByClientIdQuery {
  constructor(public readonly clientId: string) {}
}
