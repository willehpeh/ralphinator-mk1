import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTasksByProjectIdQuery } from '../get-tasks-by-project-id.query';
import { TaskReadModel } from '../../read-models/task.read-model';
import { TaskQueryHandler } from '../base';

/**
 * Query handler for retrieving all tasks associated with a specific project.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetTasksByProjectIdQuery)
export class GetTasksByProjectIdQueryHandler
  extends TaskQueryHandler<GetTasksByProjectIdQuery, TaskReadModel[]>
  implements IQueryHandler<GetTasksByProjectIdQuery, TaskReadModel[]>
{
  /**
   * Executes the GetTasksByProjectIdQuery
   *
   * @param query - The get tasks by project ID query
   * @returns Array of task read models for the specified project
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetTasksByProjectIdQuery): Promise<TaskReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findByProjectId(query.projectId),
      `Failed to retrieve tasks for project with ID ${query.projectId} from read model`
    );
  }
}
