import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetDashboardStatisticsQuery,
  DashboardStatisticsReadModel,
  GetUpcomingTasksQuery,
  TaskReadModel,
  GetRecentCommunicationsQuery,
  CommunicationReadModel,
  GetFollowUpCommunicationsQuery,
} from '@angular-nest-starter/application';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('statistics')
  async getStatistics(): Promise<DashboardStatisticsReadModel> {
    const query = new GetDashboardStatisticsQuery();
    const statistics = await this.queryBus.execute<
      GetDashboardStatisticsQuery,
      DashboardStatisticsReadModel
    >(query);
    return statistics;
  }

  @Get('tasks/upcoming')
  async getUpcomingTasks(): Promise<TaskReadModel[]> {
    const query = new GetUpcomingTasksQuery();
    const tasks = await this.queryBus.execute<
      GetUpcomingTasksQuery,
      TaskReadModel[]
    >(query);
    return tasks;
  }

  @Get('communications/recent')
  async getRecentCommunications(): Promise<CommunicationReadModel[]> {
    const query = new GetRecentCommunicationsQuery();
    const communications = await this.queryBus.execute<
      GetRecentCommunicationsQuery,
      CommunicationReadModel[]
    >(query);
    return communications;
  }

  @Get('communications/followups')
  async getFollowUpCommunications(): Promise<CommunicationReadModel[]> {
    const query = new GetFollowUpCommunicationsQuery();
    const communications = await this.queryBus.execute<
      GetFollowUpCommunicationsQuery,
      CommunicationReadModel[]
    >(query);
    return communications;
  }
}
