import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus } from '@nestjs/cqrs';
import { CreateClientHandler } from '@ralphinator-mk1/application';
import { CreateClientCommand } from '@ralphinator-mk1/application';
import { ClientAggregate } from '@ralphinator-mk1/domain';

describe('CreateClientHandler', () => {
  let handler: CreateClientHandler;
  let mockEventStore: any;
  let mockEventBus: EventBus;

  beforeEach(() => {
    // Mock event store
    mockEventStore = {
      appendEvents: vi.fn().mockResolvedValue(undefined),
    };

    // Mock event bus
    mockEventBus = {
      publish: vi.fn(),
    } as any;

    handler = new CreateClientHandler(mockEventStore, mockEventBus);
  });

  describe('execute', () => {
    it('should create a new client aggregate and persist events', async () => {
      // Arrange
      const command = new CreateClientCommand(
        'client-123',
        'Acme Corporation',
        'contact@acme.com',
        '+1234567890',
        '123 Main St, City, State 12345',
        'Active',
        'Important client'
      );

      // Act
      const clientId = await handler.execute(command);

      // Assert
      expect(clientId).toBe('client-123');
      expect(mockEventStore.appendEvents).toHaveBeenCalledTimes(1);
      expect(mockEventStore.appendEvents).toHaveBeenCalledWith(
        'client-123',
        expect.arrayContaining([
          expect.objectContaining({
            aggregateId: 'client-123',
            companyName: 'Acme Corporation',
            email: 'contact@acme.com',
            phone: '+1234567890',
            address: '123 Main St, City, State 12345',
            status: 'Active',
            notes: 'Important client',
          }),
        ]),
        -1 // Expected version for new aggregate
      );
    });

    it('should create client with optional fields as null', async () => {
      // Arrange
      const command = new CreateClientCommand(
        'client-456',
        'Beta Inc',
        'info@beta.com',
        null,
        null,
        'Prospect',
        null
      );

      // Act
      const clientId = await handler.execute(command);

      // Assert
      expect(clientId).toBe('client-456');
      expect(mockEventStore.appendEvents).toHaveBeenCalledWith(
        'client-456',
        expect.arrayContaining([
          expect.objectContaining({
            aggregateId: 'client-456',
            companyName: 'Beta Inc',
            email: 'info@beta.com',
            phone: null,
            address: null,
            status: 'Prospect',
            notes: null,
          }),
        ]),
        -1
      );
    });

    it('should publish integration event after creating client', async () => {
      // Arrange
      const command = new CreateClientCommand(
        'client-789',
        'Gamma LLC',
        'hello@gamma.com',
        '+9876543210',
        '456 Oak Ave, Town, State 67890',
        'Inactive',
        'Test notes'
      );

      // Act
      await handler.execute(command);

      // Assert
      expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: 'client-789',
          companyName: 'Gamma LLC',
          email: 'hello@gamma.com',
        })
      );
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
        mockEventStore.appendEvents.mockClear();

        const command = new CreateClientCommand(
          `client-${status}`,
          'Test Company',
          'test@test.com',
          null,
          null,
          status,
          null
        );

        // Act
        await handler.execute(command);

        // Assert
        expect(mockEventStore.appendEvents).toHaveBeenCalledWith(
          expect.any(String),
          expect.arrayContaining([
            expect.objectContaining({
              status,
            }),
          ]),
          -1
        );
      }
    });
  });
});
