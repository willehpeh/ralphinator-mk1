import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  GetDashboardStatisticsQueryHandler,
  INJECTION_TOKENS,
} from '@angular-nest-starter/application';
import {
  InMemoryClientReadRepository,
  InMemoryProjectReadRepository,
  InMemoryTaskReadRepository,
  InMemoryCommunicationReadRepository,
} from '@angular-nest-starter/infrastructure';
import { DashboardController } from './dashboard.controller';

const QueryHandlers = [GetDashboardStatisticsQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [DashboardController],
  providers: [
    ...QueryHandlers,
    // Infrastructure implementations
    {
      provide: INJECTION_TOKENS.CLIENT_READ_REPOSITORY,
      useClass: InMemoryClientReadRepository,
    },
    {
      provide: INJECTION_TOKENS.PROJECT_READ_REPOSITORY,
      useClass: InMemoryProjectReadRepository,
    },
    {
      provide: INJECTION_TOKENS.TASK_READ_REPOSITORY,
      useClass: InMemoryTaskReadRepository,
    },
    {
      provide: INJECTION_TOKENS.COMMUNICATION_READ_REPOSITORY,
      useClass: InMemoryCommunicationReadRepository,
    },
  ],
})
export class DashboardModule {}
