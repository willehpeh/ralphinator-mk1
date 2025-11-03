import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClientContactsQuery } from '../get-client-contacts.query';
import { ContactReadModel } from '../../read-models/contact.read-model';
import { ContactQueryHandler } from '../base';

/**
 * Query handler for retrieving all contacts associated with a specific client.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetClientContactsQuery)
export class GetClientContactsQueryHandler
  extends ContactQueryHandler<GetClientContactsQuery, ContactReadModel[]>
  implements IQueryHandler<GetClientContactsQuery, ContactReadModel[]>
{
  /**
   * Executes the GetClientContactsQuery
   *
   * @param query - The get client contacts query
   * @returns Array of contact read models for the specified client
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetClientContactsQuery): Promise<ContactReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findByClientId(query.clientId),
      `Failed to retrieve contacts for client with ID ${query.clientId} from read model`
    );
  }
}
