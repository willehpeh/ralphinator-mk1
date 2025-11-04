/**
 * Query to retrieve all tasks associated with a specific client.
 */
export class GetTasksByClientIdQuery {
  constructor(public readonly clientId: string) {}
}
