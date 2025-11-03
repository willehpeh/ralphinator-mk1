import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateProjectHandler,
  UpdateProjectDetailsHandler,
  ChangeProjectStatusHandler,
  GetProjectsByClientIdQueryHandler,
  GetAllProjectsQueryHandler,
  GetProjectByIdQueryHandler,
  INJECTION_TOKENS,
} from '@angular-nest-starter/application';
import {
  ProjectProjection,
  InMemoryEventStore,
  InMemoryProjectReadRepository,
  AggregateRepository,
} from '@angular-nest-starter/infrastructure';
import { ProjectsController } from './projects.controller';
import { AllProjectsController } from './all-projects.controller';

const CommandHandlers = [
  CreateProjectHandler,
  UpdateProjectDetailsHandler,
  ChangeProjectStatusHandler,
];
const QueryHandlers = [
  GetProjectsByClientIdQueryHandler,
  GetAllProjectsQueryHandler,
  GetProjectByIdQueryHandler,
];
const EventHandlers = [ProjectProjection];

@Module({
  imports: [CqrsModule],
  controllers: [ProjectsController, AllProjectsController],
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
      provide: INJECTION_TOKENS.PROJECT_READ_REPOSITORY,
      useClass: InMemoryProjectReadRepository,
    },
    {
      provide: INJECTION_TOKENS.AGGREGATE_REPOSITORY,
      useClass: AggregateRepository,
    },
  ],
})
export class ProjectsModule {}
