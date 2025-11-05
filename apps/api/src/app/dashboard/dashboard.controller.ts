import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetDashboardStatisticsQuery,
  DashboardStatisticsReadModel,
  GetUpcomingTasksQuery,
  TaskReadModel,
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
}
