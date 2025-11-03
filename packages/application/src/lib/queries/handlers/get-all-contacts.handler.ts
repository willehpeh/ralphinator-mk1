import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllContactsQuery } from '../get-all-contacts.query';
import { ContactReadModel } from '../../read-models/contact.read-model';
import { IContactReadRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Query handler for retrieving all contacts from all clients.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetAllContactsQuery)
export class GetAllContactsQueryHandler
  implements IQueryHandler<GetAllContactsQuery, ContactReadModel[]>
{
  constructor(
    @Inject(INJECTION_TOKENS.CONTACT_READ_REPOSITORY)
    private readonly contactReadRepository: IContactReadRepository
  ) {}

  /**
   * Executes the GetAllContactsQuery
   *
   * @returns Array of all contact read models
   * @throws Error if the read repository operation fails
   */
  async execute(): Promise<ContactReadModel[]> {
    try {
      return await this.contactReadRepository.findAll();
    } catch (error) {
      throw new Error(
        `Failed to retrieve all contacts from read model: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
