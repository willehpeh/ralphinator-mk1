import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllProjectsQuery, GetProjectByIdQuery, ProjectReadModel } from '@angular-nest-starter/application';

@Controller('projects')
export class AllProjectsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getAllProjects(): Promise<ProjectReadModel[]> {
    const query = new GetAllProjectsQuery();
    const projects = await this.queryBus.execute<GetAllProjectsQuery, ProjectReadModel[]>(query);
    return projects;
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<ProjectReadModel | null> {
    const query = new GetProjectByIdQuery(id);
    const project = await this.queryBus.execute<GetProjectByIdQuery, ProjectReadModel | null>(query);
    return project;
  }
}
