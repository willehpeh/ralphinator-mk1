import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRecentCommunicationsQuery } from '../get-recent-communications.query';
import { CommunicationReadModel } from '../../read-models/communication.read-model';
import { CommunicationQueryHandler } from '../base';

/**
 * Query handler for retrieving recent communications for the dashboard.
 * Returns last N communications sorted by date (newest first).
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetRecentCommunicationsQuery)
export class GetRecentCommunicationsQueryHandler
  extends CommunicationQueryHandler<
    GetRecentCommunicationsQuery,
    CommunicationReadModel[]
  >
  implements
    IQueryHandler<GetRecentCommunicationsQuery, CommunicationReadModel[]>
{
  /**
   * Executes the GetRecentCommunicationsQuery
   *
   * @param query - The get recent communications query
   * @returns Array of recent communication read models sorted by date descending
   * @throws Error if the read repository operation fails
   */
  async execute(
    query: GetRecentCommunicationsQuery
  ): Promise<CommunicationReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findRecent(query.limit),
      'Failed to retrieve recent communications from read model'
    );
  }
}
