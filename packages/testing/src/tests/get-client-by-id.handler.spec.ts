import { describe, it, expect, beforeEach } from 'vitest';
import { GetClientByIdQuery, GetClientByIdQueryHandler } from '@angular-nest-starter/application';
import { createQueryHandlerTestSetup } from '../lib/mock-factories';
import { ClientReadModelBuilder } from '../lib/builders/client-read-model.builder';
import { testAllClientStatuses } from '../lib/test-assertions';

describe('GetClientByIdQueryHandler', () => {
  const { handler, mockReadRepository } = createQueryHandlerTestSetup(GetClientByIdQueryHandler);

  beforeEach(() => {
    mockReadRepository.findAll.mockClear();
    mockReadRepository.findById.mockClear();
  });

  it('should retrieve client by id from read repository', async () => {
    // Arrange
    const clientId = 'client-123';
    const expectedClient = new ClientReadModelBuilder()
      .withId(clientId)
      .withCompanyName('Acme Corp')
      .withEmail('contact@acme.com')
      .withPhone('555-1234')
      .withAddress('123 Main St')
      .withStatus('Active')
      .withNotes('Test client')
      .withCreatedAt(new Date('2025-11-01'))
      .build();

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
    await testAllClientStatuses(async (status) => {
      // Arrange
      const clientId = `client-${status}`;
      const client = new ClientReadModelBuilder()
        .withId(clientId)
        .withCompanyName('Test Corp')
        .withEmail('test@example.com')
        .withStatus(status)
        .build();

      mockReadRepository.findById.mockResolvedValue(client);

      const query = new GetClientByIdQuery(clientId);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result?.status).toBe(status);
    });
  });
});
