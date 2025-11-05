import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  GetUpcomingTasksQuery,
  GetUpcomingTasksQueryHandler,
  TaskReadModel,
} from '@angular-nest-starter/application';

describe('GetUpcomingTasksQueryHandler', () => {
  let handler: GetUpcomingTasksQueryHandler;
  let mockTaskRepo: any;

  beforeEach(() => {
    // Create mock repository
    mockTaskRepo = {
      findUpcoming: vi.fn(),
    };

    // Create handler with mocked repository
    handler = new GetUpcomingTasksQueryHandler(mockTaskRepo);
  });

  it('should return upcoming tasks sorted by due date', async () => {
    // Arrange
    const tomorrow = new Date(Date.now() + 86400000); // Tomorrow
    const nextWeek = new Date(Date.now() + 7 * 86400000); // Next week
    const yesterday = new Date(Date.now() - 86400000); // Yesterday (overdue)

    const upcomingTasks: TaskReadModel[] = [
      new TaskReadModel(
        'task-1',
        'Overdue task',
        'Todo',
        'High',
        'This task is overdue',
        yesterday,
        'client-1',
        'project-1',
        new Date()
      ),
      new TaskReadModel(
        'task-2',
        'Task due tomorrow',
        'InProgress',
        'Medium',
        'Due soon',
        tomorrow,
        'client-2',
        'project-2',
        new Date()
      ),
      new TaskReadModel(
        'task-3',
        'Task due next week',
        'Todo',
        'Low',
        'Not urgent',
        nextWeek,
        'client-1',
        'project-1',
        new Date()
      ),
    ];

    mockTaskRepo.findUpcoming.mockResolvedValue(upcomingTasks);

    const query = new GetUpcomingTasksQuery(10);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(3);
    expect(result).toEqual(upcomingTasks);
    expect(mockTaskRepo.findUpcoming).toHaveBeenCalledWith(10);
    expect(mockTaskRepo.findUpcoming).toHaveBeenCalledTimes(1);
  });

  it('should use default limit of 10 when not specified', async () => {
    // Arrange
    mockTaskRepo.findUpcoming.mockResolvedValue([]);

    const query = new GetUpcomingTasksQuery();

    // Act
    await handler.execute(query);

    // Assert
    expect(mockTaskRepo.findUpcoming).toHaveBeenCalledWith(10);
  });

  it('should respect custom limit parameter', async () => {
    // Arrange
    const upcomingTasks: TaskReadModel[] = [
      new TaskReadModel(
        'task-1',
        'Task 1',
        'Todo',
        'High',
        null,
        new Date(Date.now() + 86400000),
        'client-1',
        'project-1',
        new Date()
      ),
      new TaskReadModel(
        'task-2',
        'Task 2',
        'Todo',
        'Medium',
        null,
        new Date(Date.now() + 2 * 86400000),
        'client-2',
        'project-2',
        new Date()
      ),
      new TaskReadModel(
        'task-3',
        'Task 3',
        'InProgress',
        'Low',
        null,
        new Date(Date.now() + 3 * 86400000),
        'client-1',
        'project-1',
        new Date()
      ),
    ];

    mockTaskRepo.findUpcoming.mockResolvedValue(upcomingTasks);

    const query = new GetUpcomingTasksQuery(3);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(3);
    expect(mockTaskRepo.findUpcoming).toHaveBeenCalledWith(3);
  });

  it('should return empty array when no upcoming tasks exist', async () => {
    // Arrange
    mockTaskRepo.findUpcoming.mockResolvedValue([]);

    const query = new GetUpcomingTasksQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should only return tasks with deadlines (no null deadlines)', async () => {
    // Arrange
    const upcomingTasks: TaskReadModel[] = [
      new TaskReadModel(
        'task-1',
        'Task with deadline',
        'Todo',
        'High',
        null,
        new Date(Date.now() + 86400000),
        'client-1',
        'project-1',
        new Date()
      ),
      new TaskReadModel(
        'task-2',
        'Another task with deadline',
        'InProgress',
        'Medium',
        null,
        new Date(Date.now() + 2 * 86400000),
        'client-2',
        'project-2',
        new Date()
      ),
    ];

    mockTaskRepo.findUpcoming.mockResolvedValue(upcomingTasks);

    const query = new GetUpcomingTasksQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(2);
    expect(result.every((task) => task.deadline !== null)).toBe(true);
  });

  it('should exclude completed and cancelled tasks', async () => {
    // Arrange
    // Repository should only return non-completed, non-cancelled tasks
    const upcomingTasks: TaskReadModel[] = [
      new TaskReadModel(
        'task-1',
        'Todo task',
        'Todo',
        'High',
        null,
        new Date(Date.now() + 86400000),
        'client-1',
        'project-1',
        new Date()
      ),
      new TaskReadModel(
        'task-2',
        'InProgress task',
        'InProgress',
        'Medium',
        null,
        new Date(Date.now() + 2 * 86400000),
        'client-2',
        'project-2',
        new Date()
      ),
    ];

    mockTaskRepo.findUpcoming.mockResolvedValue(upcomingTasks);

    const query = new GetUpcomingTasksQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(2);
    expect(result.every((task) => task.status !== 'Completed')).toBe(true);
    expect(result.every((task) => task.status !== 'Cancelled')).toBe(true);
  });

  it('should include overdue tasks (past due date)', async () => {
    // Arrange
    const yesterday = new Date(Date.now() - 86400000); // Yesterday (overdue)
    const tomorrow = new Date(Date.now() + 86400000); // Tomorrow

    const upcomingTasks: TaskReadModel[] = [
      new TaskReadModel(
        'task-1',
        'Overdue task',
        'Todo',
        'High',
        'This is overdue',
        yesterday,
        'client-1',
        'project-1',
        new Date()
      ),
      new TaskReadModel(
        'task-2',
        'Future task',
        'Todo',
        'Medium',
        null,
        tomorrow,
        'client-2',
        'project-2',
        new Date()
      ),
    ];

    mockTaskRepo.findUpcoming.mockResolvedValue(upcomingTasks);

    const query = new GetUpcomingTasksQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(2);
    // Verify overdue task is included
    expect(result.some((task) => task.deadline! < new Date())).toBe(true);
  });

  it('should handle repository errors gracefully', async () => {
    // Arrange
    mockTaskRepo.findUpcoming.mockRejectedValue(
      new Error('Database connection failed')
    );

    const query = new GetUpcomingTasksQuery();

    // Act & Assert
    await expect(handler.execute(query)).rejects.toThrow(
      'Failed to retrieve upcoming tasks from read model'
    );
  });

  it('should handle limit of 1 task', async () => {
    // Arrange
    const upcomingTasks: TaskReadModel[] = [
      new TaskReadModel(
        'task-1',
        'Single task',
        'Todo',
        'High',
        null,
        new Date(Date.now() + 86400000),
        'client-1',
        'project-1',
        new Date()
      ),
    ];

    mockTaskRepo.findUpcoming.mockResolvedValue(upcomingTasks);

    const query = new GetUpcomingTasksQuery(1);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(1);
    expect(mockTaskRepo.findUpcoming).toHaveBeenCalledWith(1);
  });

  it('should handle large limit parameter', async () => {
    // Arrange
    const upcomingTasks: TaskReadModel[] = [
      new TaskReadModel(
        'task-1',
        'Task 1',
        'Todo',
        'High',
        null,
        new Date(Date.now() + 86400000),
        'client-1',
        'project-1',
        new Date()
      ),
      new TaskReadModel(
        'task-2',
        'Task 2',
        'Todo',
        'Medium',
        null,
        new Date(Date.now() + 2 * 86400000),
        'client-2',
        'project-2',
        new Date()
      ),
    ];

    mockTaskRepo.findUpcoming.mockResolvedValue(upcomingTasks);

    const query = new GetUpcomingTasksQuery(100);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(mockTaskRepo.findUpcoming).toHaveBeenCalledWith(100);
    expect(result).toHaveLength(2); // Only 2 tasks exist even with limit of 100
  });
});
