import { IQuery } from '@nestjs/cqrs';

/**
 * Query to retrieve upcoming tasks for the dashboard.
 * Returns the next 10 non-completed tasks sorted by due date (earliest first).
 */
export class GetUpcomingTasksQuery implements IQuery {
  constructor(public readonly limit = 10) {}
}
