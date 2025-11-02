import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus } from '@nestjs/cqrs';
import { DeleteClientHandler } from '@angular-nest-starter/application';
import { DeleteClientCommand } from '@angular-nest-starter/application';
import {
  ClientDeletedDomainEvent,
  ClientCreatedDomainEvent
} from '@angular-nest-starter/domain';

describe('DeleteClientHandler', () => {
  let handler: DeleteClientHandler;
  let mockEventStore: any;
  let mockEventBus: EventBus;

  beforeEach(() => {
    // Mock event store
    mockEventStore = {
      getEvents: vi.fn(),
      appendEvents: vi.fn().mockResolvedValue(undefined),
    };

    // Mock event bus
    mockEventBus = {
      publish: vi.fn(),
    } as any;

    handler = new DeleteClientHandler(mockEventStore, mockEventBus);
  });

  describe('execute', () => {
    it('should load existing client, delete it, and persist deletion event', async () => {
      // Arrange
      const clientId = 'client-123';
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

      mockEventStore.getEvents.mockResolvedValue(existingEvents);

      const command = new DeleteClientCommand(clientId);

      // Act
      const deletedClientId = await handler.execute(command);

      // Assert
      expect(deletedClientId).toBe(clientId);
      expect(mockEventStore.getEvents).toHaveBeenCalledTimes(1);
      expect(mockEventStore.getEvents).toHaveBeenCalledWith(clientId);
      expect(mockEventStore.appendEvents).toHaveBeenCalledTimes(1);
      expect(mockEventStore.appendEvents).toHaveBeenCalledWith(
        clientId,
        expect.arrayContaining([
          expect.any(ClientDeletedDomainEvent),
        ]),
        0 // Expected version (0 because we had 1 event before)
      );
    });

    it('should publish deletion event to event bus for projections', async () => {
      // Arrange
      const clientId = 'client-456';
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

      mockEventStore.getEvents.mockResolvedValue(existingEvents);

      const command = new DeleteClientCommand(clientId);

      // Act
      await handler.execute(command);

      // Assert
      expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          aggregateId: clientId,
        })
      );
    });

    it('should use version for optimistic concurrency control', async () => {
      // Arrange
      const clientId = 'client-789';
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

      mockEventStore.getEvents.mockResolvedValue(existingEvents);

      const command = new DeleteClientCommand(clientId);

      // Act
      await handler.execute(command);

      // Assert
      // Verifies version is passed for optimistic concurrency control
      expect(mockEventStore.appendEvents).toHaveBeenCalledWith(
        clientId,
        expect.any(Array),
        0 // Version used for concurrency control
      );
    });

    it('should return the client ID after successful deletion', async () => {
      // Arrange
      const clientId = 'client-999';
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

      mockEventStore.getEvents.mockResolvedValue(existingEvents);

      const command = new DeleteClientCommand(clientId);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result).toBe(clientId);
    });
  });
});
