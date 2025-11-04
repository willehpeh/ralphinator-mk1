import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllProjectsQuery, GetProjectByIdQuery, GetTasksByProjectIdQuery, ProjectReadModel, TaskReadModel } from '@angular-nest-starter/application';

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

  @Get(':id/tasks')
  async getTasksByProjectId(@Param('id') id: string): Promise<TaskReadModel[]> {
    const query = new GetTasksByProjectIdQuery(id);
    const tasks = await this.queryBus.execute<GetTasksByProjectIdQuery, TaskReadModel[]>(query);
    return tasks;
  }
}
