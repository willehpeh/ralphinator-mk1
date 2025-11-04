import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTasksByClientIdQuery } from '../get-tasks-by-client-id.query';
import { TaskReadModel } from '../../read-models/task.read-model';
import { TaskQueryHandler } from '../base';

/**
 * Query handler for retrieving all tasks associated with a specific client.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetTasksByClientIdQuery)
export class GetTasksByClientIdQueryHandler
  extends TaskQueryHandler<GetTasksByClientIdQuery, TaskReadModel[]>
  implements IQueryHandler<GetTasksByClientIdQuery, TaskReadModel[]>
{
  /**
   * Executes the GetTasksByClientIdQuery
   *
   * @param query - The get tasks by client ID query
   * @returns Array of task read models for the specified client
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetTasksByClientIdQuery): Promise<TaskReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findByClientId(query.clientId),
      `Failed to retrieve tasks for client with ID ${query.clientId} from read model`
    );
  }
}
