import { Body, Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTaskCommand, UpdateTaskDetailsCommand, ChangeTaskStatusCommand, GetTaskByIdQuery, TaskDataPayload, TaskReadModel } from '@angular-nest-starter/application';
import { CreateTaskDto, UpdateTaskDto, ChangeTaskStatusDto, CreateTaskResponse } from '@angular-nest-starter/shared-types';
import { randomUUID } from 'crypto';
import { fetchEntityAfterMutation } from '../shared/controller-utilities';

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
  private createTaskDataPayload(dto: CreateTaskDto | UpdateTaskDto): TaskDataPayload {
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

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto
  ): Promise<TaskReadModel> {
    const data = this.createTaskDataPayload(dto);
    const command = new UpdateTaskDetailsCommand(id, data);

    const updatedTaskId = await this.commandBus.execute<UpdateTaskDetailsCommand, string>(
      command
    );

    // Return the updated task to avoid unnecessary refetch
    return fetchEntityAfterMutation(
      this.queryBus,
      GetTaskByIdQuery,
      [updatedTaskId],
      'Task',
      updatedTaskId,
      'update'
    );
  }

  @Patch(':id/status')
  async changeTaskStatus(
    @Param('id') id: string,
    @Body() dto: ChangeTaskStatusDto
  ): Promise<TaskReadModel> {
    const command = new ChangeTaskStatusCommand(id, dto.status);

    const taskId = await this.commandBus.execute<ChangeTaskStatusCommand, string>(
      command
    );

    // Return the updated task to avoid unnecessary refetch
    return fetchEntityAfterMutation(
      this.queryBus,
      GetTaskByIdQuery,
      [taskId],
      'Task',
      taskId,
      'status change'
    );
  }
}
