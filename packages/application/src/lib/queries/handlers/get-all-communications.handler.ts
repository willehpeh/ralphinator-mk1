import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllCommunicationsQuery } from '../get-all-communications.query';
import { CommunicationReadModel } from '../../read-models/communication.read-model';
import { CommunicationQueryHandler } from '../base';

/**
 * Query handler for retrieving all communications.
 * Returns communications sorted by most recent first.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetAllCommunicationsQuery)
export class GetAllCommunicationsQueryHandler
  extends CommunicationQueryHandler<GetAllCommunicationsQuery, CommunicationReadModel[]>
  implements IQueryHandler<GetAllCommunicationsQuery, CommunicationReadModel[]>
{
  /**
   * Executes the GetAllCommunicationsQuery
   *
   * @param query - The get all communications query
   * @returns Array of communication read models sorted by most recent first
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetAllCommunicationsQuery): Promise<CommunicationReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findAll(),
      'Failed to retrieve all communications from read model'
    );
  }
}
