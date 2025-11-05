import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommunicationsRequiringFollowUpQuery } from '../get-communications-requiring-follow-up.query';
import { CommunicationReadModel } from '../../read-models/communication.read-model';
import { CommunicationQueryHandler } from '../base';

/**
 * Query handler for retrieving communications requiring follow-up.
 * Returns communications where followUpRequired is true, sorted by most recent first.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetCommunicationsRequiringFollowUpQuery)
export class GetCommunicationsRequiringFollowUpQueryHandler
  extends CommunicationQueryHandler<GetCommunicationsRequiringFollowUpQuery, CommunicationReadModel[]>
  implements IQueryHandler<GetCommunicationsRequiringFollowUpQuery, CommunicationReadModel[]>
{
  /**
   * Executes the GetCommunicationsRequiringFollowUpQuery
   *
   * @param query - The get communications requiring follow-up query
   * @returns Array of communication read models that require follow-up, sorted by most recent first
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetCommunicationsRequiringFollowUpQuery): Promise<CommunicationReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findRequiringFollowUp(),
      'Failed to retrieve communications requiring follow-up from read model'
    );
  }
}
