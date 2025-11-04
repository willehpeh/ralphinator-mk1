import { describe, it, expect, beforeEach } from 'vitest';
import { CreateTaskHandler, CreateTaskCommand, TaskDataPayload } from '@angular-nest-starter/application';
import { createCommandHandlerTestSetup } from '../lib/mock-factories';
import { expectAggregateToMatch } from '../lib/test-assertions';

describe('CreateTaskHandler', () => {
  const { handler, mockRepository, getSavedAggregate, clearMocks } =
    createCommandHandlerTestSetup(CreateTaskHandler);

  beforeEach(clearMocks);

  describe('execute', () => {
    it('should create a new task aggregate and persist events', async () => {
      // Arrange
      const data = new TaskDataPayload(
        'Implement user authentication',
        'Todo',
        'High',
        'Need to add JWT authentication',
        '2025-12-31',
        'client-123',
        'project-456'
      );
      const command = new CreateTaskCommand('task-123', data);

      // Act
      const taskId = await handler.execute(command);

      // Assert
      expect(taskId).toBe('task-123');
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(getSavedAggregate()).toBeDefined();
      expectAggregateToMatch(getSavedAggregate(), {
        id: 'task-123',
        title: 'Implement user authentication',
        status: 'Todo',
        priority: 'High',
        notes: 'Need to add JWT authentication',
        clientId: 'client-123',
        projectId: 'project-456'
      });
    });

    it('should create task with optional fields as null', async () => {
      // Arrange
      const data = new TaskDataPayload(
        'Fix critical bug',
        'InProgress',
        'Urgent',
        null,
        null,
        null,
        null
      );
      const command = new CreateTaskCommand('task-456', data);

      // Act
      const taskId = await handler.execute(command);

      // Assert
      expect(taskId).toBe('task-456');
      expect(mockRepository.save).toHaveBeenCalled();
      expectAggregateToMatch(getSavedAggregate(), {
        id: 'task-456',
        title: 'Fix critical bug',
        status: 'InProgress',
        priority: 'Urgent',
        notes: null,
        deadline: null,
        clientId: null,
        projectId: null
      });
    });

    it('should persist aggregate through repository', async () => {
      // Arrange
      const data = new TaskDataPayload(
        'Code review',
        'Completed',
        'Low',
        'Review PR #123',
        null,
        null,
        null
      );
      const command = new CreateTaskCommand('task-789', data);

      // Act
      await handler.execute(command);

      // Assert
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expectAggregateToMatch(getSavedAggregate(), {
        id: 'task-789',
        title: 'Code review',
        status: 'Completed',
        priority: 'Low'
      });
    });

    it('should handle all valid task statuses', async () => {
      const statuses = ['Todo', 'InProgress', 'Completed', 'Cancelled'] as const;

      for (const status of statuses) {
        clearMocks();
        const data = new TaskDataPayload(
          'Test Task',
          status,
          'Medium',
          null,
          null,
          null,
          null
        );
        const command = new CreateTaskCommand(`task-${status}`, data);

        // Act
        await handler.execute(command);

        // Assert
        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        expect(getSavedAggregate().getStatus()).toBe(status);
      }
    });

    it('should handle all valid task priorities', async () => {
      const priorities = ['Low', 'Medium', 'High', 'Urgent'] as const;

      for (const priority of priorities) {
        clearMocks();
        const data = new TaskDataPayload(
          'Test Task',
          'Todo',
          priority,
          null,
          null,
          null,
          null
        );
        const command = new CreateTaskCommand(`task-${priority}`, data);

        // Act
        await handler.execute(command);

        // Assert
        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        expect(getSavedAggregate().getPriority()).toBe(priority);
      }
    });

    it('should handle deadline as string date', async () => {
      // Arrange
      const deadline = '2025-06-15T10:30:00Z';
      const data = new TaskDataPayload(
        'Task with deadline',
        'Todo',
        'High',
        null,
        deadline,
        null,
        null
      );
      const command = new CreateTaskCommand('task-deadline', data);

      // Act
      await handler.execute(command);

      // Assert
      expect(mockRepository.save).toHaveBeenCalled();
      const savedTask = getSavedAggregate();
      expect(savedTask.getDeadline()).toBeInstanceOf(Date);
      expect(savedTask.getDeadline()?.getTime()).toBe(new Date(deadline).getTime());
    });
  });
});
