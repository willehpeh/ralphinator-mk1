import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetContactByIdQuery } from '../get-contact-by-id.query';
import { ContactReadModel } from '../../read-models/contact.read-model';
import { IContactReadRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Query handler for retrieving a specific contact by its ID.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetContactByIdQuery)
export class GetContactByIdQueryHandler
  implements IQueryHandler<GetContactByIdQuery, ContactReadModel | null>
{
  constructor(
    @Inject(INJECTION_TOKENS.CONTACT_READ_REPOSITORY)
    private readonly contactReadRepository: IContactReadRepository
  ) {}

  /**
   * Executes the GetContactByIdQuery
   *
   * @param query - The get contact by ID query
   * @returns The contact read model or null if not found
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetContactByIdQuery): Promise<ContactReadModel | null> {
    try {
      return await this.contactReadRepository.findById(query.contactId);
    } catch (error) {
      throw new Error(
        `Failed to retrieve contact with ID ${query.contactId} from read model: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
