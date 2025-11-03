/**
 * Query to retrieve a single project by its unique identifier.
 */
export class GetProjectByIdQuery {
  constructor(public readonly id: string) {}
}
