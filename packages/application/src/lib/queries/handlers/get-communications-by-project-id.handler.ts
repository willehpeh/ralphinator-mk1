import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCommunicationsByProjectIdQuery } from '../get-communications-by-project-id.query';
import { CommunicationReadModel } from '../../read-models/communication.read-model';
import { CommunicationQueryHandler } from '../base';

/**
 * Query handler for retrieving communications by project ID.
 * Returns communications for a specific project sorted by most recent first.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetCommunicationsByProjectIdQuery)
export class GetCommunicationsByProjectIdQueryHandler
  extends CommunicationQueryHandler<GetCommunicationsByProjectIdQuery, CommunicationReadModel[]>
  implements IQueryHandler<GetCommunicationsByProjectIdQuery, CommunicationReadModel[]>
{
  /**
   * Executes the GetCommunicationsByProjectIdQuery
   *
   * @param query - The get communications by project ID query
   * @returns Array of communication read models for the specified project sorted by most recent first
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetCommunicationsByProjectIdQuery): Promise<CommunicationReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findByProjectId(query.projectId),
      `Failed to retrieve communications for project ${query.projectId} from read model`
    );
  }
}
