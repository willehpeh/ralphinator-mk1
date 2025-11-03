import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectByIdQuery } from '../get-project-by-id.query';
import { ProjectReadModel } from '../../read-models/project.read-model';
import { ProjectQueryHandler } from '../base';

/**
 * Query handler for retrieving a single project by its ID.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetProjectByIdQuery)
export class GetProjectByIdQueryHandler
  extends ProjectQueryHandler<GetProjectByIdQuery, ProjectReadModel | null>
  implements IQueryHandler<GetProjectByIdQuery, ProjectReadModel | null>
{
  /**
   * Executes the GetProjectByIdQuery
   *
   * @param query - The get project by id query
   * @returns Project read model or null if not found
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetProjectByIdQuery): Promise<ProjectReadModel | null> {
    return this.executeQuery(
      () => this.readRepository.findById(query.id),
      `Failed to retrieve project ${query.id} from read model`
    );
  }
}
