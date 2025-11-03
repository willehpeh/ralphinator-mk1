/**
 * Query to retrieve a specific contact by its ID.
 */
export class GetContactByIdQuery {
  constructor(public readonly contactId: string) {}
}
