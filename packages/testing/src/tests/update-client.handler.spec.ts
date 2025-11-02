import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateClientHandler, UpdateClientCommand, ClientDataPayload } from '@angular-nest-starter/application';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { createCommandHandlerTestSetup } from '../lib/mock-factories';
import { ClientAggregateBuilder } from '../lib/builders/client-aggregate.builder';

describe('UpdateClientHandler', () => {
  const { handler, mockRepository, getSavedAggregate } =
    createCommandHandlerTestSetup(UpdateClientHandler);

  beforeEach(() => {
    mockRepository.save.mockClear();
    mockRepository.load.mockClear();
  });

  describe('execute', () => {
    it('should update existing client information', async () => {
      // Arrange
      const existingAggregate = new ClientAggregateBuilder()
        .withId('client-123')
        .withCompanyName('Old Company Name')
        .withEmail('old@example.com')
        .withPhone('+1111111111')
        .withAddress('Old Address')
        .withStatus('Prospect')
        .withNotes('Old notes')
        .build();

      mockRepository.load.mockResolvedValue(existingAggregate);

      const updatedData = new ClientDataPayload(
        'New Company Name',
        'new@example.com',
        '+2222222222',
        'New Address',
        'Active',
        'Updated notes'
      );
      const command = new UpdateClientCommand('client-123', updatedData);

      // Act
      const clientId = await handler.execute(command);

      // Assert
      expect(clientId).toBe('client-123');
      expect(mockRepository.load).toHaveBeenCalledWith('client-123', ClientAggregate);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(getSavedAggregate()).toBeDefined();
      expect(getSavedAggregate().getId()).toBe('client-123');
      expect(getSavedAggregate().getCompanyName()).toBe('New Company Name');
      expect(getSavedAggregate().getEmail()?.getValue()).toBe('new@example.com');
      expect(getSavedAggregate().getPhone()).toBe('+2222222222');
      expect(getSavedAggregate().getAddress()).toBe('New Address');
      expect(getSavedAggregate().getStatus()).toBe('Active');
      expect(getSavedAggregate().getNotes()).toBe('Updated notes');
    });

    it('should update client with optional fields set to null', async () => {
      // Arrange
      const existingAggregate = new ClientAggregateBuilder()
        .withId('client-456')
        .withCompanyName('Existing Company')
        .withEmail('existing@example.com')
        .withPhone('+3333333333')
        .withAddress('Existing Address')
        .withStatus('Active')
        .withNotes('Existing notes')
        .build();

      mockRepository.load.mockResolvedValue(existingAggregate);

      const updatedData = new ClientDataPayload(
        'Updated Company',
        'updated@example.com',
        null,
        null,
        'Inactive',
        null
      );
      const command = new UpdateClientCommand('client-456', updatedData);

      // Act
      const clientId = await handler.execute(command);

      // Assert
      expect(clientId).toBe('client-456');
      expect(getSavedAggregate().getCompanyName()).toBe('Updated Company');
      expect(getSavedAggregate().getEmail()?.getValue()).toBe('updated@example.com');
      expect(getSavedAggregate().getPhone()).toBe(null);
      expect(getSavedAggregate().getAddress()).toBe(null);
      expect(getSavedAggregate().getStatus()).toBe('Inactive');
      expect(getSavedAggregate().getNotes()).toBe(null);
    });

    it('should update only specific fields while keeping others unchanged', async () => {
      // Arrange
      const existingAggregate = new ClientAggregateBuilder()
        .withId('client-789')
        .withCompanyName('Original Company')
        .withEmail('original@example.com')
        .withPhone('+4444444444')
        .withAddress('Original Address')
        .withStatus('Prospect')
        .withNotes('Original notes')
        .build();

      mockRepository.load.mockResolvedValue(existingAggregate);

      // Update only company name and status
      const updatedData = new ClientDataPayload(
        'Modified Company',
        'original@example.com',
        '+4444444444',
        'Original Address',
        'Active',
        'Original notes'
      );
      const command = new UpdateClientCommand('client-789', updatedData);

      // Act
      const clientId = await handler.execute(command);

      // Assert
      expect(clientId).toBe('client-789');
      expect(getSavedAggregate().getCompanyName()).toBe('Modified Company');
      expect(getSavedAggregate().getEmail()?.getValue()).toBe('original@example.com');
      expect(getSavedAggregate().getPhone()).toBe('+4444444444');
      expect(getSavedAggregate().getAddress()).toBe('Original Address');
      expect(getSavedAggregate().getStatus()).toBe('Active');
      expect(getSavedAggregate().getNotes()).toBe('Original notes');
    });

    it('should handle all valid client statuses during update', async () => {
      const statuses: Array<'Active' | 'Inactive' | 'Prospect' | 'Past Client'> = [
        'Active',
        'Inactive',
        'Prospect',
        'Past Client',
      ];

      for (const status of statuses) {
        const existingAggregate = new ClientAggregateBuilder()
          .withId(`client-${status}`)
          .withCompanyName('Test Company')
          .withEmail('test@example.com')
          .withStatus('Prospect')
          .build();

        mockRepository.load.mockResolvedValue(existingAggregate);

        const updatedData = new ClientDataPayload(
          'Test Company',
          'test@example.com',
          null,
          null,
          status,
          null
        );
        const command = new UpdateClientCommand(`client-${status}`, updatedData);

        // Act
        await handler.execute(command);

        // Assert
        expect(getSavedAggregate().getStatus()).toBe(status);

        // Reset for next iteration
        mockRepository.load.mockClear();
        mockRepository.save.mockClear();
      }
    });

    it('should persist updated aggregate through repository', async () => {
      // Arrange
      const existingAggregate = new ClientAggregateBuilder()
        .withId('client-persist')
        .withCompanyName('Before Update')
        .withEmail('before@example.com')
        .build();

      mockRepository.load.mockResolvedValue(existingAggregate);

      const updatedData = new ClientDataPayload(
        'After Update',
        'after@example.com',
        null,
        null,
        'Active',
        null
      );
      const command = new UpdateClientCommand('client-persist', updatedData);

      // Act
      await handler.execute(command);

      // Assert
      expect(mockRepository.load).toHaveBeenCalledWith('client-persist', ClientAggregate);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      const savedAggregate = getSavedAggregate();
      expect(savedAggregate).toBe(existingAggregate);
      expect(savedAggregate.getCompanyName()).toBe('After Update');
    });
  });
});
