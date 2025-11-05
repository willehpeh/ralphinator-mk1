import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUpcomingTasksQuery } from '../get-upcoming-tasks.query';
import { TaskReadModel } from '../../read-models/task.read-model';
import { TaskQueryHandler } from '../base';

/**
 * Query handler for retrieving upcoming tasks for the dashboard.
 * Returns next N incomplete tasks sorted by due date (earliest first).
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetUpcomingTasksQuery)
export class GetUpcomingTasksQueryHandler
  extends TaskQueryHandler<GetUpcomingTasksQuery, TaskReadModel[]>
  implements IQueryHandler<GetUpcomingTasksQuery, TaskReadModel[]>
{
  /**
   * Executes the GetUpcomingTasksQuery
   *
   * @param query - The get upcoming tasks query
   * @returns Array of upcoming task read models sorted by due date
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetUpcomingTasksQuery): Promise<TaskReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findUpcoming(query.limit),
      'Failed to retrieve upcoming tasks from read model'
    );
  }
}
