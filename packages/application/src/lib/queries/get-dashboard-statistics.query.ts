import { IQuery } from '@nestjs/cqrs';

/**
 * Query to retrieve dashboard statistics for workload overview
 * Returns aggregated counts for active clients, projects, pending tasks, and follow-ups
 */
export class GetDashboardStatisticsQuery implements IQuery {}
