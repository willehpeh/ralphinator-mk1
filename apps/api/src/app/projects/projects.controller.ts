import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectCommand, GetProjectsByClientIdQuery, ProjectReadModel, ProjectDataPayload } from '@angular-nest-starter/application';
import { CreateProjectDto, CreateProjectResponse } from '@angular-nest-starter/shared-types';
import { randomUUID } from 'crypto';

@Controller('clients/:clientId/projects')
export class ProjectsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Helper method to create ProjectDataPayload from DTO.
   * Centralizes the mapping logic.
   *
   * @param dto - The project data DTO
   * @param clientId - The client ID from the route parameter
   * @returns A new ProjectDataPayload instance
   */
  private createProjectDataPayload(dto: CreateProjectDto, clientId: string): ProjectDataPayload {
    return new ProjectDataPayload(
      clientId,
      dto.name,
      dto.status,
      dto.description,
      dto.startDate,
      dto.expectedEndDate,
      dto.actualEndDate,
      dto.budget,
      dto.technicalNotes
    );
  }

  @Post()
  async createProject(
    @Param('clientId') clientId: string,
    @Body() dto: CreateProjectDto
  ): Promise<CreateProjectResponse> {
    const id = randomUUID();
    const data = this.createProjectDataPayload(dto, clientId);
    const command = new CreateProjectCommand(id, data);

    const projectId = await this.commandBus.execute<CreateProjectCommand, string>(
      command
    );

    return { id: projectId, clientId };
  }

  @Get()
  async getProjectsByClientId(@Param('clientId') clientId: string): Promise<ProjectReadModel[]> {
    const query = new GetProjectsByClientIdQuery(clientId);
    const projects = await this.queryBus.execute<GetProjectsByClientIdQuery, ProjectReadModel[]>(query);
    return projects;
  }
}
