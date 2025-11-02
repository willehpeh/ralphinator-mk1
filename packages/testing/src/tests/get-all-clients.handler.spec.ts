import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetAllClientsQuery, GetAllClientsQueryHandler } from '@angular-nest-starter/application';

describe('GetAllClientsQueryHandler', () => {
  let handler: GetAllClientsQueryHandler;
  let mockReadRepository: {
    findAll: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockReadRepository = {
      findAll: vi.fn(),
    };

    handler = new GetAllClientsQueryHandler(mockReadRepository as any);
  });

  it('should retrieve all clients from read repository', async () => {
    // Arrange
    const expectedClients = [
      {
        id: 'client-1',
        companyName: 'Acme Corp',
        email: 'contact@acme.com',
        phone: '555-1234',
        address: '123 Main St',
        status: 'Active' as const,
        notes: 'Test client 1',
        createdAt: new Date('2025-11-01'),
      },
      {
        id: 'client-2',
        companyName: 'TechCo',
        email: 'info@techco.com',
        phone: '555-5678',
        address: '456 Oak Ave',
        status: 'Prospect' as const,
        notes: null,
        createdAt: new Date('2025-11-02'),
      },
    ];

    mockReadRepository.findAll.mockResolvedValue(expectedClients);

    const query = new GetAllClientsQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toEqual(expectedClients);
    expect(mockReadRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no clients exist', async () => {
    // Arrange
    mockReadRepository.findAll.mockResolvedValue([]);

    const query = new GetAllClientsQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toEqual([]);
    expect(mockReadRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple clients with different statuses', async () => {
    // Arrange
    const clients = [
      {
        id: 'client-active',
        companyName: 'Active Corp',
        email: 'active@example.com',
        phone: null,
        address: null,
        status: 'Active' as const,
        notes: null,
        createdAt: new Date(),
      },
      {
        id: 'client-inactive',
        companyName: 'Inactive Corp',
        email: 'inactive@example.com',
        phone: null,
        address: null,
        status: 'Inactive' as const,
        notes: null,
        createdAt: new Date(),
      },
      {
        id: 'client-prospect',
        companyName: 'Prospect Corp',
        email: 'prospect@example.com',
        phone: null,
        address: null,
        status: 'Prospect' as const,
        notes: null,
        createdAt: new Date(),
      },
      {
        id: 'client-past',
        companyName: 'Past Client Corp',
        email: 'past@example.com',
        phone: null,
        address: null,
        status: 'Past Client' as const,
        notes: null,
        createdAt: new Date(),
      },
    ];

    mockReadRepository.findAll.mockResolvedValue(clients);

    const query = new GetAllClientsQuery();

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(4);
    expect(result[0].status).toBe('Active');
    expect(result[1].status).toBe('Inactive');
    expect(result[2].status).toBe('Prospect');
    expect(result[3].status).toBe('Past Client');
  });
});
