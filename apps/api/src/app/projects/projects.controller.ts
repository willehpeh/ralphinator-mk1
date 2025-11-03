import { Body, Controller, Get, Param, Post, Put, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectCommand, UpdateProjectDetailsCommand, GetProjectsByClientIdQuery, GetProjectByIdQuery, ProjectReadModel, ProjectDataPayload } from '@angular-nest-starter/application';
import { CreateProjectDto, UpdateProjectDto, CreateProjectResponse } from '@angular-nest-starter/shared-types';
import { randomUUID } from 'crypto';

@Controller('clients/:clientId/projects')
export class ProjectsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Helper method to fetch a project by ID after a mutation command.
   * Throws a NotFoundException if the project is not found.
   *
   * @param projectId - The ID of the project to fetch
   * @param operation - Description of the operation for error message (e.g., 'update')
   * @returns The project read model
   * @throws NotFoundException if the project is not found after the mutation
   */
  private async fetchProjectAfterMutation(
    projectId: string,
    operation: string
  ): Promise<ProjectReadModel> {
    const query = new GetProjectByIdQuery(projectId);
    const project = await this.queryBus.execute<GetProjectByIdQuery, ProjectReadModel | null>(query);

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${projectId} not found after ${operation}`
      );
    }

    return project;
  }

  /**
   * Helper method to create ProjectDataPayload from DTO.
   * Centralizes the mapping logic.
   *
   * @param dto - The project data DTO
   * @param clientId - The client ID from the route parameter
   * @returns A new ProjectDataPayload instance
   */
  private createProjectDataPayload(dto: CreateProjectDto | UpdateProjectDto, clientId: string): ProjectDataPayload {
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

  @Put(':projectId')
  async updateProject(
    @Param('clientId') clientId: string,
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectDto
  ): Promise<ProjectReadModel> {
    const data = this.createProjectDataPayload(dto, clientId);
    const command = new UpdateProjectDetailsCommand(projectId, data);

    const updatedProjectId = await this.commandBus.execute<UpdateProjectDetailsCommand, string>(
      command
    );

    // Return the updated project to avoid unnecessary refetch
    return this.fetchProjectAfterMutation(updatedProjectId, 'update');
  }
}
