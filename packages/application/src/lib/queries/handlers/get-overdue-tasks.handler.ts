import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOverdueTasksQuery } from '../get-overdue-tasks.query';
import { TaskReadModel } from '../../read-models/task.read-model';
import { TaskQueryHandler } from '../base';

/**
 * Query handler for retrieving overdue tasks for the dashboard.
 * Returns tasks with due dates in the past that are not completed, sorted by due date (oldest first).
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetOverdueTasksQuery)
export class GetOverdueTasksQueryHandler
  extends TaskQueryHandler<GetOverdueTasksQuery, TaskReadModel[]>
  implements IQueryHandler<GetOverdueTasksQuery, TaskReadModel[]>
{
  /**
   * Executes the GetOverdueTasksQuery
   *
   * @param query - The get overdue tasks query
   * @returns Array of overdue task read models sorted by due date (oldest first)
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetOverdueTasksQuery): Promise<TaskReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findOverdue(),
      'Failed to retrieve overdue tasks from read model'
    );
  }
}
