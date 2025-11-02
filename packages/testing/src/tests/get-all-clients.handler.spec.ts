import { describe, it, expect, beforeEach } from 'vitest';
import { GetAllClientsQuery, GetAllClientsQueryHandler } from '@angular-nest-starter/application';
import { createQueryHandlerTestSetup } from '../lib/mock-factories';
import { ClientReadModelBuilder } from '../lib/builders/client-read-model.builder';

describe('GetAllClientsQueryHandler', () => {
  const { handler, mockReadRepository } = createQueryHandlerTestSetup(GetAllClientsQueryHandler);

  beforeEach(() => {
    mockReadRepository.findAll.mockClear();
    mockReadRepository.findById.mockClear();
  });

  it('should retrieve all clients from read repository', async () => {
    // Arrange
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
        .withStatus('Prospect')
        .withNotes(null)
        .withCreatedAt(new Date('2025-11-02'))
        .build(),
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
      new ClientReadModelBuilder()
        .withId('client-active')
        .withCompanyName('Active Corp')
        .withEmail('active@example.com')
        .withStatus('Active')
        .build(),
      new ClientReadModelBuilder()
        .withId('client-inactive')
        .withCompanyName('Inactive Corp')
        .withEmail('inactive@example.com')
        .withStatus('Inactive')
        .build(),
      new ClientReadModelBuilder()
        .withId('client-prospect')
        .withCompanyName('Prospect Corp')
        .withEmail('prospect@example.com')
        .withStatus('Prospect')
        .build(),
      new ClientReadModelBuilder()
        .withId('client-past')
        .withCompanyName('Past Client Corp')
        .withEmail('past@example.com')
        .withStatus('Past Client')
        .build(),
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
