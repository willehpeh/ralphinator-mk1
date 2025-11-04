import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTaskCommand, GetTaskByIdQuery, TaskDataPayload, TaskReadModel } from '@angular-nest-starter/application';
import { CreateTaskDto, CreateTaskResponse } from '@angular-nest-starter/shared-types';
import { randomUUID } from 'crypto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Helper method to create TaskDataPayload from DTO.
   * Centralizes the mapping logic.
   *
   * @param dto - The task data DTO
   * @returns A new TaskDataPayload instance
   */
  private createTaskDataPayload(dto: CreateTaskDto): TaskDataPayload {
    return new TaskDataPayload(
      dto.title,
      dto.status,
      dto.priority,
      dto.notes,
      dto.dueDate,
      dto.clientId,
      dto.projectId
    );
  }

  @Post()
  async createTask(
    @Body() dto: CreateTaskDto
  ): Promise<CreateTaskResponse> {
    const id = randomUUID();
    const data = this.createTaskDataPayload(dto);
    const command = new CreateTaskCommand(id, data);

    const taskId = await this.commandBus.execute<CreateTaskCommand, string>(
      command
    );

    return { id: taskId };
  }

  @Get(':id')
  async getTaskById(
    @Param('id') id: string
  ): Promise<TaskReadModel> {
    const query = new GetTaskByIdQuery(id);

    const task = await this.queryBus.execute<GetTaskByIdQuery, TaskReadModel | null>(
      query
    );

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }
}
