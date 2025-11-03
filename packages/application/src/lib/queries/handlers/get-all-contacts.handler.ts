import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllContactsQuery } from '../get-all-contacts.query';
import { ContactReadModel } from '../../read-models/contact.read-model';
import { ContactQueryHandler } from '../base';

/**
 * Query handler for retrieving all contacts from all clients.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetAllContactsQuery)
export class GetAllContactsQueryHandler
  extends ContactQueryHandler<GetAllContactsQuery, ContactReadModel[]>
  implements IQueryHandler<GetAllContactsQuery, ContactReadModel[]>
{
  /**
   * Executes the GetAllContactsQuery
   *
   * @returns Array of all contact read models
   * @throws Error if the read repository operation fails
   */
  async execute(): Promise<ContactReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findAll(),
      'Failed to retrieve all contacts from read model'
    );
  }
}
