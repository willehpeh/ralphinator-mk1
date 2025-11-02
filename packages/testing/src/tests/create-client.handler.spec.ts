import { describe, it, expect, beforeEach } from 'vitest';
import { CreateClientHandler, CreateClientCommand, ClientDataPayload } from '@angular-nest-starter/application';
import { createCommandHandlerTestSetup } from '../lib/mock-factories';
import { expectAggregateToMatch, testAllClientStatuses } from '../lib/test-assertions';

describe('CreateClientHandler', () => {
  const { handler, mockRepository, getSavedAggregate, clearMocks } =
    createCommandHandlerTestSetup(CreateClientHandler);

  beforeEach(clearMocks);

  describe('execute', () => {
    it('should create a new client aggregate and persist events', async () => {
      // Arrange
      const data = new ClientDataPayload(
        'Acme Corporation',
        'contact@acme.com',
        '+1234567890',
        '123 Main St, City, State 12345',
        'Active',
        'Important client'
      );
      const command = new CreateClientCommand('client-123', data);

      // Act
      const clientId = await handler.execute(command);

      // Assert
      expect(clientId).toBe('client-123');
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(getSavedAggregate()).toBeDefined();
      expectAggregateToMatch(getSavedAggregate(), {
        id: 'client-123',
        companyName: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1234567890',
        address: '123 Main St, City, State 12345',
        status: 'Active',
        notes: 'Important client'
      });
    });

    it('should create client with optional fields as null', async () => {
      // Arrange
      const data = new ClientDataPayload(
        'Beta Inc',
        'info@beta.com',
        null,
        null,
        'Prospect',
        null
      );
      const command = new CreateClientCommand('client-456', data);

      // Act
      const clientId = await handler.execute(command);

      // Assert
      expect(clientId).toBe('client-456');
      expect(mockRepository.save).toHaveBeenCalled();
      expectAggregateToMatch(getSavedAggregate(), {
        id: 'client-456',
        companyName: 'Beta Inc',
        email: 'info@beta.com',
        phone: null,
        address: null,
        status: 'Prospect',
        notes: null
      });
    });

    it('should persist aggregate through repository', async () => {
      // Arrange
      const data = new ClientDataPayload(
        'Gamma LLC',
        'hello@gamma.com',
        '+9876543210',
        '456 Oak Ave, Town, State 67890',
        'Inactive',
        'Test notes'
      );
      const command = new CreateClientCommand('client-789', data);

      // Act
      await handler.execute(command);

      // Assert
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expectAggregateToMatch(getSavedAggregate(), {
        id: 'client-789',
        companyName: 'Gamma LLC',
        email: 'hello@gamma.com'
      });
    });

    it('should handle all valid client statuses', async () => {
      await testAllClientStatuses(async (status) => {
        const data = new ClientDataPayload(
          'Test Company',
          'test@test.com',
          null,
          null,
          status,
          null
        );
        const command = new CreateClientCommand(`client-${status}`, data);

        // Act
        await handler.execute(command);

        // Assert
        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        expect(getSavedAggregate().getStatus()).toBe(status);
      }, clearMocks);
    });
  });
});
