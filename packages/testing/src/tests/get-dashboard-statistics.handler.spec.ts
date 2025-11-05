import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  GetDashboardStatisticsQuery,
  GetDashboardStatisticsQueryHandler,
  ClientReadModel,
  ProjectReadModel,
  TaskReadModel,
  CommunicationReadModel,
  DashboardStatisticsReadModel,
} from '@angular-nest-starter/application';

describe('GetDashboardStatisticsQueryHandler', () => {
  let handler: GetDashboardStatisticsQueryHandler;
  let mockClientRepo: any;
  let mockProjectRepo: any;
  let mockTaskRepo: any;
  let mockCommunicationRepo: any;

  beforeEach(() => {
    // Create mock repositories
    mockClientRepo = {
      findAll: vi.fn(),
    };
    mockProjectRepo = {
      findAll: vi.fn(),
    };
    mockTaskRepo = {
      findAll: vi.fn(),
    };
    mockCommunicationRepo = {
      findRequiringFollowUp: vi.fn(),
    };

    // Create handler with mocked repositories
    handler = new GetDashboardStatisticsQueryHandler(
      mockClientRepo,
      mockProjectRepo,
      mockTaskRepo,
      mockCommunicationRepo
    );
  });

  it('should calculate correct statistics with typical data', async () => {
    // Arrange
    const clients: ClientReadModel[] = [
      new ClientReadModel(
        'client-1',
        'Acme Corp',
        'acme@example.com',
        '555-1111',
        '123 Main St',
        'Active',
        'Active client',
        new Date()
      ),
      new ClientReadModel(
        'client-2',
        'TechCo',
        'tech@example.com',
        '555-2222',
        '456 Oak Ave',
        'Active',
        null,
        new Date()
      ),
      new ClientReadModel(
        'client-3',
        'Old Corp',
        'old@example.com',
        '555-3333',
        '789 Elm St',
        'Inactive',
        'Inactive client',
        new Date()
      ),
    ];

    const projects: ProjectReadModel[] = [
      new ProjectReadModel(
        'project-1',
        'client-1',
        'Website Redesign',
        'Active',
        'Redesign company website',
        new Date(),
        null,
        null,
        10000,
        null,
        new Date()
      ),
      new ProjectReadModel(
        'project-2',
        'client-2',
        'Mobile App',
        'Active',
        'Build mobile app',
        new Date(),
        null,
        null,
        20000,
        null,
        new Date()
      ),
      new ProjectReadModel(
        'project-3',
        'client-1',
        'Old Project',
        'Completed',
        'Completed project',
        new Date(),
        new Date(),
        new Date(),
        5000,
        null,
        new Date()
      ),
    ];

    const tasks: TaskReadModel[] = [
      new TaskReadModel(
        'task-1',
        'Design homepage',
        'Todo',
        'High',
        'Design the homepage',
        new Date(),
        'client-1',
        'project-1',
        new Date()
      ),
      new TaskReadModel(
        'task-2',
        'Build API',
        'InProgress',
        'Medium',
        'Build the API',
        new Date(),
        'client-2',
        'project-2',
        new Date()
      ),
      new TaskReadModel(
        'task-3',
        'Write tests',
        'Completed',
        'Low',
        'Write unit tests',
        new Date(),
        'client-1',
        'project-1',
        new Date()
      ),
    ];

    const communications: CommunicationReadModel[] = [
      new CommunicationReadModel(
        'comm-1',
        'Email',
        'Project kickoff',
        new Date(),
        null,
        'Discussed project scope',
        'client-1',
        'Acme Corp',
        'contact-1',
        'John Doe',
        'project-1',
        'Website Redesign',
        true,
        new Date(Date.now() + 86400000), // Tomorrow
        false,
        new Date(),
        new Date()
      ),
      new CommunicationReadModel(
        'comm-2',
        'Phone',
        'Weekly check-in',
        new Date(),
        30,
        'Status update',
        'client-2',
        'TechCo',
        'contact-2',
        'Jane Smith',
        'project-2',
        'Mobile App',
        true,
        new Date(Date.now() - 86400000), // Yesterday (overdue)
        false,
        new Date(),
        new Date()
      ),
    ];

    mockClientRepo.findAll.mockResolvedValue(clients);
    mockProjectRepo.findAll.mockResolvedValue(projects);
    mockTaskRepo.findAll.mockResolvedValue(tasks);
    mockCommunicationRepo.findRequiringFollowUp.mockResolvedValue(communications);

    const query = new GetDashboardStatisticsQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toBeInstanceOf(DashboardStatisticsReadModel);
    expect(result.activeClientsCount).toBe(2); // 2 Active clients
    expect(result.activeProjectsCount).toBe(2); // 2 Active projects
    expect(result.pendingTasksCount).toBe(2); // 1 Todo + 1 InProgress
    expect(result.followUpsRequiredCount).toBe(2); // 2 communications requiring follow-up

    // Verify all repositories were called
    expect(mockClientRepo.findAll).toHaveBeenCalledTimes(1);
    expect(mockProjectRepo.findAll).toHaveBeenCalledTimes(1);
    expect(mockTaskRepo.findAll).toHaveBeenCalledTimes(1);
    expect(mockCommunicationRepo.findRequiringFollowUp).toHaveBeenCalledTimes(1);
  });

  it('should return zero counts when no data exists', async () => {
    // Arrange
    mockClientRepo.findAll.mockResolvedValue([]);
    mockProjectRepo.findAll.mockResolvedValue([]);
    mockTaskRepo.findAll.mockResolvedValue([]);
    mockCommunicationRepo.findRequiringFollowUp.mockResolvedValue([]);

    const query = new GetDashboardStatisticsQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.activeClientsCount).toBe(0);
    expect(result.activeProjectsCount).toBe(0);
    expect(result.pendingTasksCount).toBe(0);
    expect(result.followUpsRequiredCount).toBe(0);
  });

  it('should only count active clients', async () => {
    // Arrange
    const clients: ClientReadModel[] = [
      new ClientReadModel(
        'client-1',
        'Active Corp',
        'active@example.com',
        '555-1111',
        '123 St',
        'Active',
        null,
        new Date()
      ),
      new ClientReadModel(
        'client-2',
        'Prospect Corp',
        'prospect@example.com',
        '555-2222',
        '456 St',
        'Prospect',
        null,
        new Date()
      ),
      new ClientReadModel(
        'client-3',
        'Inactive Corp',
        'inactive@example.com',
        '555-3333',
        '789 St',
        'Inactive',
        null,
        new Date()
      ),
      new ClientReadModel(
        'client-4',
        'Past Corp',
        'past@example.com',
        '555-4444',
        '012 St',
        'Past Client',
        null,
        new Date()
      ),
    ];

    mockClientRepo.findAll.mockResolvedValue(clients);
    mockProjectRepo.findAll.mockResolvedValue([]);
    mockTaskRepo.findAll.mockResolvedValue([]);
    mockCommunicationRepo.findRequiringFollowUp.mockResolvedValue([]);

    const query = new GetDashboardStatisticsQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.activeClientsCount).toBe(1); // Only 'Active' status
  });

  it('should only count active projects', async () => {
    // Arrange
    const projects: ProjectReadModel[] = [
      new ProjectReadModel(
        'project-1',
        'client-1',
        'Active Project 1',
        'Active',
        null,
        null,
        null,
        null,
        null,
        null,
        new Date()
      ),
      new ProjectReadModel(
        'project-2',
        'client-1',
        'Active Project 2',
        'Active',
        null,
        null,
        null,
        null,
        null,
        null,
        new Date()
      ),
      new ProjectReadModel(
        'project-3',
        'client-2',
        'Completed Project',
        'Completed',
        null,
        null,
        null,
        null,
        null,
        null,
        new Date()
      ),
      new ProjectReadModel(
        'project-4',
        'client-2',
        'On Hold Project',
        'On Hold',
        null,
        null,
        null,
        null,
        null,
        null,
        new Date()
      ),
    ];

    mockClientRepo.findAll.mockResolvedValue([]);
    mockProjectRepo.findAll.mockResolvedValue(projects);
    mockTaskRepo.findAll.mockResolvedValue([]);
    mockCommunicationRepo.findRequiringFollowUp.mockResolvedValue([]);

    const query = new GetDashboardStatisticsQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.activeProjectsCount).toBe(2); // Only 'Active' status
  });

  it('should only count pending tasks (Todo and InProgress)', async () => {
    // Arrange
    const tasks: TaskReadModel[] = [
      new TaskReadModel(
        'task-1',
        'Todo Task',
        'Todo',
        'High',
        null,
        null,
        null,
        null,
        new Date()
      ),
      new TaskReadModel(
        'task-2',
        'InProgress Task 1',
        'InProgress',
        'Medium',
        null,
        null,
        null,
        null,
        new Date()
      ),
      new TaskReadModel(
        'task-3',
        'InProgress Task 2',
        'InProgress',
        'Low',
        null,
        null,
        null,
        null,
        new Date()
      ),
      new TaskReadModel(
        'task-4',
        'Completed Task',
        'Completed',
        'High',
        null,
        null,
        null,
        null,
        new Date()
      ),
    ];

    mockClientRepo.findAll.mockResolvedValue([]);
    mockProjectRepo.findAll.mockResolvedValue([]);
    mockTaskRepo.findAll.mockResolvedValue(tasks);
    mockCommunicationRepo.findRequiringFollowUp.mockResolvedValue([]);

    const query = new GetDashboardStatisticsQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.pendingTasksCount).toBe(3); // 1 Todo + 2 InProgress
  });

  it('should handle repository errors gracefully', async () => {
    // Arrange
    mockClientRepo.findAll.mockRejectedValue(new Error('Database connection failed'));

    const query = new GetDashboardStatisticsQuery();

    // Act & Assert
    await expect(handler.execute(query)).rejects.toThrow(
      'Failed to retrieve dashboard statistics from read models'
    );
  });

  it('should fetch all data in parallel using Promise.all', async () => {
    // Arrange
    const clients: ClientReadModel[] = [
      new ClientReadModel(
        'client-1',
        'Test Corp',
        'test@example.com',
        '555-0000',
        '1 St',
        'Active',
        null,
        new Date()
      ),
    ];

    // Add delays to verify parallel execution
    mockClientRepo.findAll.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(clients), 10))
    );
    mockProjectRepo.findAll.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 10))
    );
    mockTaskRepo.findAll.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 10))
    );
    mockCommunicationRepo.findRequiringFollowUp.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 10))
    );

    const query = new GetDashboardStatisticsQuery();
    const startTime = Date.now();

    // Act
    await handler.execute(query);
    const endTime = Date.now();

    // Assert - if sequential, would take ~40ms; parallel should be ~10ms
    const executionTime = endTime - startTime;
    expect(executionTime).toBeLessThan(30); // Allow some margin for test execution
  });
});
