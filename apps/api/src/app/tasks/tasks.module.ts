import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateTaskHandler,
  ChangeTaskStatusHandler,
  DeleteTaskHandler,
  INJECTION_TOKENS,
} from '@angular-nest-starter/application';
import {
  TaskProjection,
  InMemoryEventStore,
  InMemoryTaskReadRepository,
  AggregateRepository,
} from '@angular-nest-starter/infrastructure';
import { TasksController } from './tasks.controller';

const CommandHandlers = [
  CreateTaskHandler,
  ChangeTaskStatusHandler,
  DeleteTaskHandler,
];
const QueryHandlers: never[] = [];
const EventHandlers = [TaskProjection];

@Module({
  imports: [CqrsModule],
  controllers: [TasksController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    // Infrastructure implementations
    {
      provide: INJECTION_TOKENS.EVENT_STORE,
      useClass: InMemoryEventStore,
    },
    {
      provide: INJECTION_TOKENS.TASK_READ_REPOSITORY,
      useClass: InMemoryTaskReadRepository,
    },
    {
      provide: INJECTION_TOKENS.AGGREGATE_REPOSITORY,
      useClass: AggregateRepository,
    },
  ],
})
export class TasksModule {}
