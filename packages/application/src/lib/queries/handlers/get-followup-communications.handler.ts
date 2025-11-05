import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFollowUpCommunicationsQuery } from '../get-followup-communications.query';
import { CommunicationReadModel } from '../../read-models/communication.read-model';
import { CommunicationQueryHandler } from '../base';

/**
 * Query handler for retrieving communications requiring follow-up for the dashboard.
 * Returns all communications with requiresFollowUp=true where follow-up is not yet completed,
 * sorted by follow-up date (earliest first).
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetFollowUpCommunicationsQuery)
export class GetFollowUpCommunicationsQueryHandler
  extends CommunicationQueryHandler<
    GetFollowUpCommunicationsQuery,
    CommunicationReadModel[]
  >
  implements
    IQueryHandler<GetFollowUpCommunicationsQuery, CommunicationReadModel[]>
{
  /**
   * Executes the GetFollowUpCommunicationsQuery
   *
   * @param query - The get follow-up communications query
   * @returns Array of communication read models requiring follow-up, sorted by followUpDate ascending
   * @throws Error if the read repository operation fails
   */
  async execute(
    query: GetFollowUpCommunicationsQuery
  ): Promise<CommunicationReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findRequiringFollowUp(),
      'Failed to retrieve follow-up communications from read model'
    );
  }
}
