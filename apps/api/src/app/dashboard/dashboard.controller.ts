import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetDashboardStatisticsQuery,
  DashboardStatisticsReadModel,
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
}
