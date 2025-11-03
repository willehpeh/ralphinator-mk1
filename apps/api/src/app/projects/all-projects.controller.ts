import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllProjectsQuery, ProjectReadModel } from '@angular-nest-starter/application';

@Controller('projects')
export class AllProjectsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getAllProjects(): Promise<ProjectReadModel[]> {
    const query = new GetAllProjectsQuery();
    const projects = await this.queryBus.execute<GetAllProjectsQuery, ProjectReadModel[]>(query);
    return projects;
  }
}
