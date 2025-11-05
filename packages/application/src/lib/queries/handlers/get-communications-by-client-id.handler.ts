import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommunicationsByClientIdQuery } from '../get-communications-by-client-id.query';
import { CommunicationReadModel } from '../../read-models/communication.read-model';
import { CommunicationQueryHandler } from '../base';

/**
 * Query handler for retrieving communications by client ID.
 * Returns communications for a specific client sorted by most recent first.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetCommunicationsByClientIdQuery)
export class GetCommunicationsByClientIdQueryHandler
  extends CommunicationQueryHandler<GetCommunicationsByClientIdQuery, CommunicationReadModel[]>
  implements IQueryHandler<GetCommunicationsByClientIdQuery, CommunicationReadModel[]>
{
  /**
   * Executes the GetCommunicationsByClientIdQuery
   *
   * @param query - The get communications by client ID query
   * @returns Array of communication read models for the specified client sorted by most recent first
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetCommunicationsByClientIdQuery): Promise<CommunicationReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findByClientId(query.clientId),
      `Failed to retrieve communications for client ${query.clientId} from read model`
    );
  }
}
