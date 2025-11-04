import { TaskStatus, TaskPriority } from '@angular-nest-starter/shared-types';

/**
 * Frontend task interface matching the backend TaskDto.
 * Represents a task in the task management system.
 */
export interface Task {
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

/**
 * Input interface for creating a new task.
 * Matches CreateTaskDto structure from backend.
 */
export interface CreateTaskInput {
  title: string;
  notes?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null;
  clientId?: string | null;
  projectId?: string | null;
}

/**
 * Input interface for updating an existing task.
 * Matches UpdateTaskDto structure from backend.
 */
export interface UpdateTaskInput {
  title: string;
  notes?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null;
  clientId?: string | null;
  projectId?: string | null;
}
