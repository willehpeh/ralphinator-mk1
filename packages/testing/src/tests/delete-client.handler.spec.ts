import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteClientHandler } from '@angular-nest-starter/application';
import { DeleteClientCommand } from '@angular-nest-starter/application';
import {
  ClientCreatedDomainEvent,
  ClientAggregate
} from '@angular-nest-starter/domain';

describe('DeleteClientHandler', () => {
  let handler: DeleteClientHandler;
  let mockAggregateRepository: any;
  let savedAggregate: any;

  beforeEach(() => {
    savedAggregate = null;

    // Mock aggregate repository
    mockAggregateRepository = {
      load: vi.fn(),
      save: vi.fn().mockImplementation(async (aggregate) => {
        savedAggregate = aggregate;
      }),
    };

    handler = new DeleteClientHandler(mockAggregateRepository);
  });

  describe('execute', () => {
    it('should load existing client, delete it, and persist deletion event', async () => {
      // Arrange
      const clientId = 'client-123';
      const aggregate = new ClientAggregate();
      const existingEvents = [
        new ClientCreatedDomainEvent(
          clientId,
          'Acme Corporation',
          'contact@acme.com',
          '+1234567890',
          '123 Main St',
          'Active',
          'Important client'
        ),
      ];
      existingEvents.forEach(event => aggregate.apply(event));

      mockAggregateRepository.load.mockResolvedValue(aggregate);

      const command = new DeleteClientCommand(clientId);

      // Act
      const deletedClientId = await handler.execute(command);

      // Assert
      expect(deletedClientId).toBe(clientId);
      expect(mockAggregateRepository.load).toHaveBeenCalledWith(clientId, ClientAggregate);
      expect(mockAggregateRepository.save).toHaveBeenCalledTimes(1);
      expect(savedAggregate).toBe(aggregate);
    });

    it('should load aggregate and save through repository', async () => {
      // Arrange
      const clientId = 'client-456';
      const aggregate = new ClientAggregate();
      const existingEvents = [
        new ClientCreatedDomainEvent(
          clientId,
          'Beta Inc',
          'info@beta.com',
          null,
          null,
          'Prospect',
          null
        ),
      ];
      existingEvents.forEach(event => aggregate.apply(event));

      mockAggregateRepository.load.mockResolvedValue(aggregate);

      const command = new DeleteClientCommand(clientId);

      // Act
      await handler.execute(command);

      // Assert
      expect(mockAggregateRepository.load).toHaveBeenCalledWith(clientId, ClientAggregate);
      expect(mockAggregateRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should call delete on the aggregate', async () => {
      // Arrange
      const clientId = 'client-789';
      const aggregate = new ClientAggregate();
      const existingEvents = [
        new ClientCreatedDomainEvent(
          clientId,
          'Gamma LLC',
          'hello@gamma.com',
          '+9876543210',
          '456 Oak Ave',
          'Active',
          'Test notes'
        ),
      ];
      existingEvents.forEach(event => aggregate.apply(event));

      mockAggregateRepository.load.mockResolvedValue(aggregate);

      const command = new DeleteClientCommand(clientId);

      // Act
      await handler.execute(command);

      // Assert
      expect(savedAggregate).toBe(aggregate);
      expect(savedAggregate.getUncommittedEvents().length).toBeGreaterThan(0);
    });

    it('should return the client ID after successful deletion', async () => {
      // Arrange
      const clientId = 'client-999';
      const aggregate = new ClientAggregate();
      const existingEvents = [
        new ClientCreatedDomainEvent(
          clientId,
          'Test Corp',
          'test@test.com',
          null,
          null,
          'Inactive',
          null
        ),
      ];
      existingEvents.forEach(event => aggregate.apply(event));

      mockAggregateRepository.load.mockResolvedValue(aggregate);

      const command = new DeleteClientCommand(clientId);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result).toBe(clientId);
    });
  });
});
