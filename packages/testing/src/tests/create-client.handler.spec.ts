import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateClientHandler } from '@angular-nest-starter/application';
import { CreateClientCommand } from '@angular-nest-starter/application';

describe('CreateClientHandler', () => {
  let handler: CreateClientHandler;
  let mockAggregateRepository: any;
  let savedAggregate: any;

  beforeEach(() => {
    savedAggregate = null;

    // Mock aggregate repository
    mockAggregateRepository = {
      save: vi.fn().mockImplementation(async (aggregate) => {
        savedAggregate = aggregate;
      }),
      load: vi.fn(),
    };

    handler = new CreateClientHandler(mockAggregateRepository);
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
      expect(mockAggregateRepository.save).toHaveBeenCalledTimes(1);
      expect(savedAggregate).toBeDefined();
      expect(savedAggregate.getId()).toBe('client-123');
      expect(savedAggregate.getCompanyName()).toBe('Acme Corporation');
      expect(savedAggregate.getEmail()).toBe('contact@acme.com');
      expect(savedAggregate.getPhone()).toBe('+1234567890');
      expect(savedAggregate.getAddress()).toBe('123 Main St, City, State 12345');
      expect(savedAggregate.getStatus()).toBe('Active');
      expect(savedAggregate.getNotes()).toBe('Important client');
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
      expect(mockAggregateRepository.save).toHaveBeenCalled();
      expect(savedAggregate.getId()).toBe('client-456');
      expect(savedAggregate.getCompanyName()).toBe('Beta Inc');
      expect(savedAggregate.getEmail()).toBe('info@beta.com');
      expect(savedAggregate.getPhone()).toBe(null);
      expect(savedAggregate.getAddress()).toBe(null);
      expect(savedAggregate.getStatus()).toBe('Prospect');
      expect(savedAggregate.getNotes()).toBe(null);
    });

    it('should persist aggregate through repository', async () => {
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
      expect(mockAggregateRepository.save).toHaveBeenCalledTimes(1);
      expect(savedAggregate.getId()).toBe('client-789');
      expect(savedAggregate.getCompanyName()).toBe('Gamma LLC');
      expect(savedAggregate.getEmail()).toBe('hello@gamma.com');
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
        mockAggregateRepository.save.mockClear();
        savedAggregate = null;

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
        expect(mockAggregateRepository.save).toHaveBeenCalledTimes(1);
        expect(savedAggregate.getStatus()).toBe(status);
      }
    });
  });
});
