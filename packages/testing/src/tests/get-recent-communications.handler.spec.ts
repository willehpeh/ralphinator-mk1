import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  GetRecentCommunicationsQuery,
  GetRecentCommunicationsQueryHandler,
  CommunicationReadModel,
} from '@angular-nest-starter/application';

describe('GetRecentCommunicationsQueryHandler', () => {
  let handler: GetRecentCommunicationsQueryHandler;
  let mockCommunicationRepo: any;

  beforeEach(() => {
    // Create mock repository
    mockCommunicationRepo = {
      findRecent: vi.fn(),
    };

    // Create handler with mocked repository
    handler = new GetRecentCommunicationsQueryHandler(mockCommunicationRepo);
  });

  it('should return recent communications sorted by date descending', async () => {
    // Arrange
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    const lastWeek = new Date(Date.now() - 7 * 86400000);

    const recentCommunications: CommunicationReadModel[] = [
      new CommunicationReadModel(
        'comm-1',
        'Email',
        'Project kickoff discussion',
        today,
        null,
        'Discussed project timeline and deliverables',
        'client-1',
        'Acme Corp',
        'contact-1',
        'John Doe',
        'project-1',
        'Website Redesign',
        false,
        null,
        false,
        today,
        today
      ),
      new CommunicationReadModel(
        'comm-2',
        'Call',
        'Status update call',
        yesterday,
        30,
        'Reviewed progress on current sprint',
        'client-2',
        'Tech Solutions Inc',
        'contact-2',
        'Jane Smith',
        'project-2',
        'Mobile App',
        true,
        new Date(Date.now() + 86400000),
        false,
        yesterday,
        yesterday
      ),
      new CommunicationReadModel(
        'comm-3',
        'Meeting',
        'Requirements gathering',
        lastWeek,
        60,
        'Gathered detailed requirements for new feature',
        'client-1',
        'Acme Corp',
        'contact-1',
        'John Doe',
        'project-1',
        'Website Redesign',
        false,
        null,
        false,
        lastWeek,
        lastWeek
      ),
    ];

    mockCommunicationRepo.findRecent.mockResolvedValue(recentCommunications);

    const query = new GetRecentCommunicationsQuery(10);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(3);
    expect(result).toEqual(recentCommunications);
    expect(mockCommunicationRepo.findRecent).toHaveBeenCalledWith(10);
    expect(mockCommunicationRepo.findRecent).toHaveBeenCalledTimes(1);
  });

  it('should use default limit of 10 when not specified', async () => {
    // Arrange
    mockCommunicationRepo.findRecent.mockResolvedValue([]);

    const query = new GetRecentCommunicationsQuery();

    // Act
    await handler.execute(query);

    // Assert
    expect(mockCommunicationRepo.findRecent).toHaveBeenCalledWith(10);
  });

  it('should respect custom limit parameter', async () => {
    // Arrange
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000);

    const recentCommunications: CommunicationReadModel[] = [
      new CommunicationReadModel(
        'comm-1',
        'Email',
        'Subject 1',
        today,
        null,
        'Notes 1',
        'client-1',
        'Client 1',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        today,
        today
      ),
      new CommunicationReadModel(
        'comm-2',
        'Call',
        'Subject 2',
        yesterday,
        15,
        'Notes 2',
        'client-2',
        'Client 2',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        yesterday,
        yesterday
      ),
      new CommunicationReadModel(
        'comm-3',
        'Meeting',
        'Subject 3',
        twoDaysAgo,
        30,
        'Notes 3',
        'client-1',
        'Client 1',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        twoDaysAgo,
        twoDaysAgo
      ),
    ];

    mockCommunicationRepo.findRecent.mockResolvedValue(recentCommunications);

    const query = new GetRecentCommunicationsQuery(3);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(3);
    expect(mockCommunicationRepo.findRecent).toHaveBeenCalledWith(3);
  });

  it('should return empty array when no communications exist', async () => {
    // Arrange
    mockCommunicationRepo.findRecent.mockResolvedValue([]);

    const query = new GetRecentCommunicationsQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should return communications with all required fields populated', async () => {
    // Arrange
    const communicationDate = new Date();
    const followUpDate = new Date(Date.now() + 7 * 86400000);

    const recentCommunications: CommunicationReadModel[] = [
      new CommunicationReadModel(
        'comm-1',
        'Email',
        'Complete communication',
        communicationDate,
        45,
        'Detailed notes about the communication',
        'client-1',
        'Acme Corp',
        'contact-1',
        'John Doe',
        'project-1',
        'Website Redesign',
        true,
        followUpDate,
        false,
        communicationDate,
        communicationDate
      ),
    ];

    mockCommunicationRepo.findRecent.mockResolvedValue(recentCommunications);

    const query = new GetRecentCommunicationsQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(1);
    const comm = result[0];
    expect(comm.id).toBe('comm-1');
    expect(comm.type).toBe('Email');
    expect(comm.subject).toBe('Complete communication');
    expect(comm.communicationDate).toEqual(communicationDate);
    expect(comm.duration).toBe(45);
    expect(comm.notes).toBe('Detailed notes about the communication');
    expect(comm.clientId).toBe('client-1');
    expect(comm.clientName).toBe('Acme Corp');
    expect(comm.contactId).toBe('contact-1');
    expect(comm.contactName).toBe('John Doe');
    expect(comm.projectId).toBe('project-1');
    expect(comm.projectName).toBe('Website Redesign');
    expect(comm.followUpRequired).toBe(true);
    expect(comm.followUpDate).toEqual(followUpDate);
    expect(comm.followUpCompleted).toBe(false);
    expect(comm.createdAt).toEqual(communicationDate);
    expect(comm.updatedAt).toEqual(communicationDate);
  });

  it('should handle communications without optional fields', async () => {
    // Arrange
    const communicationDate = new Date();

    const recentCommunications: CommunicationReadModel[] = [
      new CommunicationReadModel(
        'comm-1',
        'Chat',
        'Quick chat',
        communicationDate,
        null,
        'Brief chat message',
        'client-1',
        'Acme Corp',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        communicationDate,
        communicationDate
      ),
    ];

    mockCommunicationRepo.findRecent.mockResolvedValue(recentCommunications);

    const query = new GetRecentCommunicationsQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(1);
    const comm = result[0];
    expect(comm.duration).toBeNull();
    expect(comm.contactId).toBeNull();
    expect(comm.contactName).toBeNull();
    expect(comm.projectId).toBeNull();
    expect(comm.projectName).toBeNull();
    expect(comm.followUpDate).toBeNull();
  });

  it('should handle repository errors gracefully', async () => {
    // Arrange
    mockCommunicationRepo.findRecent.mockRejectedValue(
      new Error('Database connection failed')
    );

    const query = new GetRecentCommunicationsQuery();

    // Act & Assert
    await expect(handler.execute(query)).rejects.toThrow(
      'Failed to retrieve recent communications from read model'
    );
  });

  it('should handle limit of 1 communication', async () => {
    // Arrange
    const today = new Date();

    const recentCommunications: CommunicationReadModel[] = [
      new CommunicationReadModel(
        'comm-1',
        'Email',
        'Single communication',
        today,
        null,
        'Notes',
        'client-1',
        'Client 1',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        today,
        today
      ),
    ];

    mockCommunicationRepo.findRecent.mockResolvedValue(recentCommunications);

    const query = new GetRecentCommunicationsQuery(1);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(1);
    expect(mockCommunicationRepo.findRecent).toHaveBeenCalledWith(1);
  });

  it('should handle large limit parameter', async () => {
    // Arrange
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    const recentCommunications: CommunicationReadModel[] = [
      new CommunicationReadModel(
        'comm-1',
        'Email',
        'Communication 1',
        today,
        null,
        'Notes',
        'client-1',
        'Client 1',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        today,
        today
      ),
      new CommunicationReadModel(
        'comm-2',
        'Call',
        'Communication 2',
        yesterday,
        15,
        'Notes',
        'client-2',
        'Client 2',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        yesterday,
        yesterday
      ),
    ];

    mockCommunicationRepo.findRecent.mockResolvedValue(recentCommunications);

    const query = new GetRecentCommunicationsQuery(100);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(mockCommunicationRepo.findRecent).toHaveBeenCalledWith(100);
    expect(result).toHaveLength(2); // Only 2 communications exist even with limit of 100
  });

  it('should include all communication types', async () => {
    // Arrange
    const today = new Date();

    const recentCommunications: CommunicationReadModel[] = [
      new CommunicationReadModel(
        'comm-1',
        'Call',
        'Phone call',
        today,
        30,
        'Notes',
        'client-1',
        'Client 1',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        today,
        today
      ),
      new CommunicationReadModel(
        'comm-2',
        'Email',
        'Email communication',
        today,
        null,
        'Notes',
        'client-2',
        'Client 2',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        today,
        today
      ),
      new CommunicationReadModel(
        'comm-3',
        'Meeting',
        'In-person meeting',
        today,
        60,
        'Notes',
        'client-3',
        'Client 3',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        today,
        today
      ),
      new CommunicationReadModel(
        'comm-4',
        'Chat',
        'Chat message',
        today,
        null,
        'Notes',
        'client-4',
        'Client 4',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        today,
        today
      ),
      new CommunicationReadModel(
        'comm-5',
        'Other',
        'Other type',
        today,
        null,
        'Notes',
        'client-5',
        'Client 5',
        null,
        null,
        null,
        null,
        false,
        null,
        false,
        today,
        today
      ),
    ];

    mockCommunicationRepo.findRecent.mockResolvedValue(recentCommunications);

    const query = new GetRecentCommunicationsQuery(10);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(5);
    const types = result.map((comm) => comm.type);
    expect(types).toContain('Call');
    expect(types).toContain('Email');
    expect(types).toContain('Meeting');
    expect(types).toContain('Chat');
    expect(types).toContain('Other');
  });
});
