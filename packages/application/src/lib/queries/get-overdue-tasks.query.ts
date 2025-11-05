import { IQuery } from '@nestjs/cqrs';

/**
 * Query to retrieve overdue tasks for the dashboard.
 * Returns tasks with due dates in the past that are not completed, sorted by due date (oldest first).
 */
export class GetOverdueTasksQuery implements IQuery {
  constructor() {}
}
