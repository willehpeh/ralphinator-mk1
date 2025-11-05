/**
 * Read model for dashboard statistics queries
 * Optimized DTO for dashboard workload overview
 */
export class DashboardStatisticsReadModel {
  constructor(
    public readonly activeClientsCount: number,
    public readonly activeProjectsCount: number,
    public readonly pendingTasksCount: number,
    public readonly followUpsRequiredCount: number
  ) {}
}
