/**
 * Query to retrieve all tasks associated with a specific project.
 */
export class GetTasksByProjectIdQuery {
  constructor(public readonly projectId: string) {}
}
