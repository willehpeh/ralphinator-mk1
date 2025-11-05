import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommunicationsByTypeQuery } from '../get-communications-by-type.query';
import { CommunicationReadModel } from '../../read-models/communication.read-model';
import { CommunicationQueryHandler } from '../base';

/**
 * Query handler for retrieving communications by type.
 * Returns communications of a specific type sorted by most recent first.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetCommunicationsByTypeQuery)
export class GetCommunicationsByTypeQueryHandler
  extends CommunicationQueryHandler<GetCommunicationsByTypeQuery, CommunicationReadModel[]>
  implements IQueryHandler<GetCommunicationsByTypeQuery, CommunicationReadModel[]>
{
  /**
   * Executes the GetCommunicationsByTypeQuery
   *
   * @param query - The get communications by type query
   * @returns Array of communication read models of the specified type sorted by most recent first
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetCommunicationsByTypeQuery): Promise<CommunicationReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findByType(query.type),
      `Failed to retrieve communications of type ${query.type} from read model`
    );
  }
}
