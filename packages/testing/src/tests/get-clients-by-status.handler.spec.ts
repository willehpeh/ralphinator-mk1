import { describe, it, expect, beforeEach } from 'vitest';
import { GetClientsByStatusQuery, GetClientsByStatusQueryHandler } from '@angular-nest-starter/application';
import { createQueryHandlerTestSetup } from '../lib/mock-factories';
import { ClientReadModelBuilder } from '../lib/builders/client-read-model.builder';
import { testAllClientStatuses } from '../lib/test-assertions';

describe('GetClientsByStatusQueryHandler', () => {
  const { handler, mockReadRepository } = createQueryHandlerTestSetup(GetClientsByStatusQueryHandler);

  beforeEach(() => {
    mockReadRepository.findAll.mockClear();
    mockReadRepository.findById.mockClear();
    mockReadRepository.findByStatus.mockClear();
  });

  it('should retrieve clients by status from read repository', async () => {
    // Arrange
    const status = 'Active';
    const expectedClients = [
      new ClientReadModelBuilder()
        .withId('client-1')
        .withCompanyName('Acme Corp')
        .withEmail('contact@acme.com')
        .withPhone('555-1234')
        .withAddress('123 Main St')
        .withStatus('Active')
        .withNotes('Test client 1')
        .withCreatedAt(new Date('2025-11-01'))
        .build(),
      new ClientReadModelBuilder()
        .withId('client-2')
        .withCompanyName('TechCo')
        .withEmail('info@techco.com')
        .withPhone('555-5678')
        .withAddress('456 Oak Ave')
        .withStatus('Active')
        .withNotes('Test client 2')
        .withCreatedAt(new Date('2025-11-02'))
        .build(),
    ];

    mockReadRepository.findByStatus.mockResolvedValue(expectedClients);

    const query = new GetClientsByStatusQuery(status);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toEqual(expectedClients);
    expect(mockReadRepository.findByStatus).toHaveBeenCalledWith(status);
    expect(mockReadRepository.findByStatus).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no clients exist with the specified status', async () => {
    // Arrange
    const status = 'Inactive';
    mockReadRepository.findByStatus.mockResolvedValue([]);

    const query = new GetClientsByStatusQuery(status);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toEqual([]);
    expect(mockReadRepository.findByStatus).toHaveBeenCalledWith(status);
    expect(mockReadRepository.findByStatus).toHaveBeenCalledTimes(1);
  });

  it('should handle all client statuses', async () => {
    await testAllClientStatuses(async (status) => {
      // Arrange
      const clients = [
        new ClientReadModelBuilder()
          .withId(`client-${status}-1`)
          .withCompanyName(`Company ${status}`)
          .withEmail('test@example.com')
          .withStatus(status)
          .build(),
        new ClientReadModelBuilder()
          .withId(`client-${status}-2`)
          .withCompanyName(`Another ${status} Corp`)
          .withEmail('another@example.com')
          .withStatus(status)
          .build(),
      ];

      mockReadRepository.findByStatus.mockResolvedValue(clients);

      const query = new GetClientsByStatusQuery(status);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].status).toBe(status);
      expect(result[1].status).toBe(status);
      expect(mockReadRepository.findByStatus).toHaveBeenCalledWith(status);
    }, () => mockReadRepository.findByStatus.mockClear());
  });

  it('should only return clients matching the specified status', async () => {
    // Arrange
    const activeClients = [
      new ClientReadModelBuilder()
        .withId('client-active-1')
        .withCompanyName('Active Corp 1')
        .withEmail('active1@example.com')
        .withStatus('Active')
        .build(),
      new ClientReadModelBuilder()
        .withId('client-active-2')
        .withCompanyName('Active Corp 2')
        .withEmail('active2@example.com')
        .withStatus('Active')
        .build(),
    ];

    mockReadRepository.findByStatus.mockResolvedValue(activeClients);

    const query = new GetClientsByStatusQuery('Active');

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result).toHaveLength(2);
    expect(result.every((client) => client.status === 'Active')).toBe(true);
    expect(mockReadRepository.findByStatus).toHaveBeenCalledWith('Active');
  });
});
