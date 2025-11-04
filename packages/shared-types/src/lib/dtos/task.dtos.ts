import { IsString, IsOptional, IsIn, IsNotEmpty, IsDateString } from 'class-validator';
import { TaskStatus, TASK_STATUS_VALUES } from '../types/task-status.type';
import { TaskPriority, TASK_PRIORITY_VALUES } from '../types/task-priority.type';

/**
 * Base DTO containing all task data fields.
 * Used for create and update operations.
 */
export class TaskDataDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  notes?: string | null;

  @IsIn(TASK_PRIORITY_VALUES)
  priority!: TaskPriority;

  @IsIn(TASK_STATUS_VALUES)
  status!: TaskStatus;

  @IsDateString()
  @IsOptional()
  dueDate?: string | null;

  @IsString()
  @IsOptional()
  clientId?: string | null;

  @IsString()
  @IsOptional()
  projectId?: string | null;
}

/**
 * DTO for creating a new task.
 */
export class CreateTaskDto extends TaskDataDto {}

/**
 * DTO for updating an existing task.
 */
export class UpdateTaskDto extends TaskDataDto {}

/**
 * Response DTO for task creation.
 */
export interface CreateTaskResponse {
  id: string;
}

/**
 * Response DTO for task retrieval.
 * Matches the TaskReadModel structure.
 */
export interface TaskDto {
  id: string;
  title: string;
  notes: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date | null;
  clientId: string | null;
  projectId: string | null;
  createdAt: Date;
}
