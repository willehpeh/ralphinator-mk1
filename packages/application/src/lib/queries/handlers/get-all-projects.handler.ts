import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllProjectsQuery } from '../get-all-projects.query';
import { ProjectReadModel } from '../../read-models/project.read-model';
import { ProjectQueryHandler } from '../base';

/**
 * Query handler for retrieving all projects across all clients in the system.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetAllProjectsQuery)
export class GetAllProjectsQueryHandler
  extends ProjectQueryHandler<GetAllProjectsQuery, ProjectReadModel[]>
  implements IQueryHandler<GetAllProjectsQuery, ProjectReadModel[]>
{
  /**
   * Executes the GetAllProjectsQuery
   *
   * @param query - The get all projects query
   * @returns Array of all project read models in the system
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetAllProjectsQuery): Promise<ProjectReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findAll(),
      'Failed to retrieve all projects from read model'
    );
  }
}
