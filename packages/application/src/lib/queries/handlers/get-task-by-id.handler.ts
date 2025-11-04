import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTaskByIdQuery } from '../get-task-by-id.query';
import { TaskReadModel } from '../../read-models/task.read-model';
import { TaskQueryHandler } from '../base';

/**
 * Query handler for retrieving a task by ID.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetTaskByIdQuery)
export class GetTaskByIdQueryHandler
  extends TaskQueryHandler<GetTaskByIdQuery, TaskReadModel | null>
  implements IQueryHandler<GetTaskByIdQuery, TaskReadModel | null>
{
  /**
   * Executes the GetTaskByIdQuery
   *
   * @param query - The get task by ID query
   * @returns The task read model or null if not found
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetTaskByIdQuery): Promise<TaskReadModel | null> {
    return this.executeQuery(
      () => this.readRepository.findById(query.id),
      `Failed to retrieve task with ID ${query.id} from read model`
    );
  }
}
