import { describe, it, expect, beforeEach } from 'vitest';
import { GetClientByIdQuery, GetClientByIdQueryHandler } from '@angular-nest-starter/application';
import { createMockReadRepository } from '../lib/mock-factories';

describe('GetClientByIdQueryHandler', () => {
  let handler: GetClientByIdQueryHandler;
  let mockReadRepository: ReturnType<typeof createMockReadRepository>;

  beforeEach(() => {
    mockReadRepository = createMockReadRepository();

    handler = new GetClientByIdQueryHandler(mockReadRepository);
  });

  it('should retrieve client by id from read repository', async () => {
    // Arrange
    const clientId = 'client-123';
    const expectedClient = {
      id: clientId,
      companyName: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '555-1234',
      address: '123 Main St',
      status: 'Active' as const,
      notes: 'Test client',
      createdAt: new Date('2025-11-01'),
    };

    mockReadRepository.findById.mockResolvedValue(expectedClient);

    const query = new GetClientByIdQuery(clientId);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toEqual(expectedClient);
    expect(mockReadRepository.findById).toHaveBeenCalledWith(clientId);
    expect(mockReadRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should return null when client is not found', async () => {
    // Arrange
    const clientId = 'non-existent-id';
    mockReadRepository.findById.mockResolvedValue(null);

    const query = new GetClientByIdQuery(clientId);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toBeNull();
    expect(mockReadRepository.findById).toHaveBeenCalledWith(clientId);
  });

  it('should handle all client statuses', async () => {
    const statuses = ['Active', 'Inactive', 'Prospect', 'Past Client'] as const;

    for (const status of statuses) {
      // Arrange
      const clientId = `client-${status}`;
      const client = {
        id: clientId,
        companyName: 'Test Corp',
        email: 'test@example.com',
        phone: null,
        address: null,
        status,
        notes: null,
        createdAt: new Date(),
      };

      mockReadRepository.findById.mockResolvedValue(client);

      const query = new GetClientByIdQuery(clientId);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result?.status).toBe(status);
    }
  });
});
