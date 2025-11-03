import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClientContactsQuery } from '../get-client-contacts.query';
import { ContactReadModel } from '../../read-models/contact.read-model';
import { IContactReadRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Query handler for retrieving all contacts associated with a specific client.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetClientContactsQuery)
export class GetClientContactsQueryHandler
  implements IQueryHandler<GetClientContactsQuery, ContactReadModel[]>
{
  constructor(
    @Inject(INJECTION_TOKENS.CONTACT_READ_REPOSITORY)
    private readonly contactReadRepository: IContactReadRepository
  ) {}

  /**
   * Executes the GetClientContactsQuery
   *
   * @param query - The get client contacts query
   * @returns Array of contact read models for the specified client
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetClientContactsQuery): Promise<ContactReadModel[]> {
    try {
      return await this.contactReadRepository.findByClientId(query.clientId);
    } catch (error) {
      throw new Error(
        `Failed to retrieve contacts for client with ID ${query.clientId} from read model: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
