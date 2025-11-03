import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectsByClientIdQuery } from '../get-projects-by-client-id.query';
import { ProjectReadModel } from '../../read-models/project.read-model';
import { IProjectReadRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Query handler for retrieving all projects associated with a specific client.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetProjectsByClientIdQuery)
export class GetProjectsByClientIdQueryHandler
  implements IQueryHandler<GetProjectsByClientIdQuery, ProjectReadModel[]>
{
  constructor(
    @Inject(INJECTION_TOKENS.PROJECT_READ_REPOSITORY)
    private readonly projectReadRepository: IProjectReadRepository
  ) {}

  /**
   * Executes the GetProjectsByClientIdQuery
   *
   * @param query - The get projects by client ID query
   * @returns Array of project read models for the specified client
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetProjectsByClientIdQuery): Promise<ProjectReadModel[]> {
    try {
      return await this.projectReadRepository.findByClientId(query.clientId);
    } catch (error) {
      throw new Error(
        `Failed to retrieve projects for client with ID ${query.clientId} from read model: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
