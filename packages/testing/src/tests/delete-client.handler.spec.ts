import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteClientHandler } from '@angular-nest-starter/application';
import { DeleteClientCommand } from '@angular-nest-starter/application';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { createCommandHandlerTestSetup, ClientAggregateBuilder } from '../lib/mock-factories';

describe('DeleteClientHandler', () => {
  const { handler, mockRepository, getSavedAggregate } =
    createCommandHandlerTestSetup(DeleteClientHandler);

  beforeEach(() => {
    mockRepository.save.mockClear();
    mockRepository.load.mockClear();
  });

  describe('execute', () => {
    it('should load existing client, delete it, and persist deletion event', async () => {
      // Arrange
      const clientId = 'client-123';
      const aggregate = new ClientAggregateBuilder()
        .withId(clientId)
        .withCompanyName('Acme Corporation')
        .withEmail('contact@acme.com')
        .withPhone('+1234567890')
        .withAddress('123 Main St')
        .withStatus('Active')
        .withNotes('Important client')
        .build();

      mockRepository.load.mockResolvedValue(aggregate);

      const command = new DeleteClientCommand(clientId);

      // Act
      const deletedClientId = await handler.execute(command);

      // Assert
      expect(deletedClientId).toBe(clientId);
      expect(mockRepository.load).toHaveBeenCalledWith(clientId, ClientAggregate);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(getSavedAggregate()).toBe(aggregate);
    });

    it('should load aggregate and save through repository', async () => {
      // Arrange
      const clientId = 'client-456';
      const aggregate = new ClientAggregateBuilder()
        .withId(clientId)
        .withCompanyName('Beta Inc')
        .withEmail('info@beta.com')
        .withStatus('Prospect')
        .build();

      mockRepository.load.mockResolvedValue(aggregate);

      const command = new DeleteClientCommand(clientId);

      // Act
      await handler.execute(command);

      // Assert
      expect(mockRepository.load).toHaveBeenCalledWith(clientId, ClientAggregate);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should call delete on the aggregate', async () => {
      // Arrange
      const clientId = 'client-789';
      const aggregate = new ClientAggregateBuilder()
        .withId(clientId)
        .withCompanyName('Gamma LLC')
        .withEmail('hello@gamma.com')
        .withPhone('+9876543210')
        .withAddress('456 Oak Ave')
        .withStatus('Active')
        .withNotes('Test notes')
        .build();

      mockRepository.load.mockResolvedValue(aggregate);

      const command = new DeleteClientCommand(clientId);

      // Act
      await handler.execute(command);

      // Assert
      expect(getSavedAggregate()).toBe(aggregate);
      expect(getSavedAggregate().getUncommittedEvents().length).toBeGreaterThan(0);
    });

    it('should return the client ID after successful deletion', async () => {
      // Arrange
      const clientId = 'client-999';
      const aggregate = new ClientAggregateBuilder()
        .withId(clientId)
        .withCompanyName('Test Corp')
        .withEmail('test@test.com')
        .withStatus('Inactive')
        .build();

      mockRepository.load.mockResolvedValue(aggregate);

      const command = new DeleteClientCommand(clientId);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result).toBe(clientId);
    });
  });
});
