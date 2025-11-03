import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectsByClientIdQuery } from '../get-projects-by-client-id.query';
import { ProjectReadModel } from '../../read-models/project.read-model';
import { ProjectQueryHandler } from '../base';

/**
 * Query handler for retrieving all projects associated with a specific client.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetProjectsByClientIdQuery)
export class GetProjectsByClientIdQueryHandler
  extends ProjectQueryHandler<GetProjectsByClientIdQuery, ProjectReadModel[]>
  implements IQueryHandler<GetProjectsByClientIdQuery, ProjectReadModel[]>
{
  /**
   * Executes the GetProjectsByClientIdQuery
   *
   * @param query - The get projects by client ID query
   * @returns Array of project read models for the specified client
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetProjectsByClientIdQuery): Promise<ProjectReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findByClientId(query.clientId),
      `Failed to retrieve projects for client with ID ${query.clientId} from read model`
    );
  }
}
