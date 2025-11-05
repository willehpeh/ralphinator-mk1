import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetDashboardStatisticsQuery } from '../get-dashboard-statistics.query';
import { DashboardStatisticsReadModel } from '../../read-models/dashboard-statistics.read-model';
import {
  IClientReadRepository,
  IProjectReadRepository,
  ITaskReadRepository,
  ICommunicationReadRepository,
  INJECTION_TOKENS,
} from '../../ports';

/**
 * Query handler for retrieving dashboard statistics.
 * Calculates aggregated counts across clients, projects, tasks, and communications.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetDashboardStatisticsQuery)
export class GetDashboardStatisticsQueryHandler
  implements IQueryHandler<GetDashboardStatisticsQuery, DashboardStatisticsReadModel>
{
  constructor(
    @Inject(INJECTION_TOKENS.CLIENT_READ_REPOSITORY)
    private readonly clientReadRepository: IClientReadRepository,
    @Inject(INJECTION_TOKENS.PROJECT_READ_REPOSITORY)
    private readonly projectReadRepository: IProjectReadRepository,
    @Inject(INJECTION_TOKENS.TASK_READ_REPOSITORY)
    private readonly taskReadRepository: ITaskReadRepository,
    @Inject(INJECTION_TOKENS.COMMUNICATION_READ_REPOSITORY)
    private readonly communicationReadRepository: ICommunicationReadRepository
  ) {}

  /**
   * Executes the GetDashboardStatisticsQuery
   * Counts active clients, active projects, pending tasks, and follow-ups required
   *
   * @param _query - The get dashboard statistics query (unused)
   * @returns Dashboard statistics read model with aggregated counts
   * @throws Error if any read repository operation fails
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_query: GetDashboardStatisticsQuery): Promise<DashboardStatisticsReadModel> {
    try {
      // Fetch all data in parallel for performance
      const [clients, projects, tasks, communications] = await Promise.all([
        this.clientReadRepository.findAll(),
        this.projectReadRepository.findAll(),
        this.taskReadRepository.findAll(),
        this.communicationReadRepository.findRequiringFollowUp(),
      ]);

      // Count active clients (status = 'Active')
      const activeClientsCount = clients.filter(
        (client) => client.status === 'Active'
      ).length;

      // Count active projects (status = 'Active')
      const activeProjectsCount = projects.filter(
        (project) => project.status === 'Active'
      ).length;

      // Count pending tasks (status = 'Todo' or 'InProgress')
      const pendingTasksCount = tasks.filter(
        (task) => task.status === 'Todo' || task.status === 'InProgress'
      ).length;

      // Follow-ups required count (already filtered by repository method)
      const followUpsRequiredCount = communications.length;

      return new DashboardStatisticsReadModel(
        activeClientsCount,
        activeProjectsCount,
        pendingTasksCount,
        followUpsRequiredCount
      );
    } catch (error) {
      throw new Error(
        `Failed to retrieve dashboard statistics from read models: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
