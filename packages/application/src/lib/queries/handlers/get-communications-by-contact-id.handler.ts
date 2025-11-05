import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommunicationsByContactIdQuery } from '../get-communications-by-contact-id.query';
import { CommunicationReadModel } from '../../read-models/communication.read-model';
import { CommunicationQueryHandler } from '../base';

/**
 * Query handler for retrieving communications by contact ID.
 * Returns communications for a specific contact sorted by most recent first.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetCommunicationsByContactIdQuery)
export class GetCommunicationsByContactIdQueryHandler
  extends CommunicationQueryHandler<GetCommunicationsByContactIdQuery, CommunicationReadModel[]>
  implements IQueryHandler<GetCommunicationsByContactIdQuery, CommunicationReadModel[]>
{
  /**
   * Executes the GetCommunicationsByContactIdQuery
   *
   * @param query - The get communications by contact ID query
   * @returns Array of communication read models for the specified contact sorted by most recent first
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetCommunicationsByContactIdQuery): Promise<CommunicationReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findByContactId(query.contactId),
      `Failed to retrieve communications for contact ${query.contactId} from read model`
    );
  }
}
