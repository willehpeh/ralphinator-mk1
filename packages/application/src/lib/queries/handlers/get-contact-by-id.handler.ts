import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetContactByIdQuery } from '../get-contact-by-id.query';
import { ContactReadModel } from '../../read-models/contact.read-model';
import { ContactQueryHandler } from '../base';

/**
 * Query handler for retrieving a specific contact by its ID.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetContactByIdQuery)
export class GetContactByIdQueryHandler
  extends ContactQueryHandler<GetContactByIdQuery, ContactReadModel | null>
  implements IQueryHandler<GetContactByIdQuery, ContactReadModel | null>
{
  /**
   * Executes the GetContactByIdQuery
   *
   * @param query - The get contact by ID query
   * @returns The contact read model or null if not found
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetContactByIdQuery): Promise<ContactReadModel | null> {
    return this.executeQuery(
      () => this.readRepository.findById(query.contactId),
      `Failed to retrieve contact with ID ${query.contactId} from read model`
    );
  }
}
