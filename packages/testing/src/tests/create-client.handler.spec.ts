import { describe, it, expect, beforeEach } from 'vitest';
import { CreateClientHandler, CreateClientCommand, ClientDataPayload } from '@angular-nest-starter/application';
import { createCommandHandlerTestSetup } from '../lib/mock-factories';

describe('CreateClientHandler', () => {
  const { handler, mockRepository, getSavedAggregate, resetSavedAggregate } =
    createCommandHandlerTestSetup(CreateClientHandler);

  beforeEach(() => {
    mockRepository.save.mockClear();
    resetSavedAggregate();
  });

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
      expect(getSavedAggregate().getId()).toBe('client-123');
      expect(getSavedAggregate().getCompanyName()).toBe('Acme Corporation');
      expect(getSavedAggregate().getEmail()).toBe('contact@acme.com');
      expect(getSavedAggregate().getPhone()).toBe('+1234567890');
      expect(getSavedAggregate().getAddress()).toBe('123 Main St, City, State 12345');
      expect(getSavedAggregate().getStatus()).toBe('Active');
      expect(getSavedAggregate().getNotes()).toBe('Important client');
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
      expect(getSavedAggregate().getId()).toBe('client-456');
      expect(getSavedAggregate().getCompanyName()).toBe('Beta Inc');
      expect(getSavedAggregate().getEmail()).toBe('info@beta.com');
      expect(getSavedAggregate().getPhone()).toBe(null);
      expect(getSavedAggregate().getAddress()).toBe(null);
      expect(getSavedAggregate().getStatus()).toBe('Prospect');
      expect(getSavedAggregate().getNotes()).toBe(null);
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
      expect(getSavedAggregate().getId()).toBe('client-789');
      expect(getSavedAggregate().getCompanyName()).toBe('Gamma LLC');
      expect(getSavedAggregate().getEmail()).toBe('hello@gamma.com');
    });

    it('should handle all valid client statuses', async () => {
      const statuses: Array<'Active' | 'Inactive' | 'Prospect' | 'Past Client'> = [
        'Active',
        'Inactive',
        'Prospect',
        'Past Client',
      ];

      for (const status of statuses) {
        // Reset mocks
        mockRepository.save.mockClear();
        resetSavedAggregate();

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
      }
    });
  });
});
