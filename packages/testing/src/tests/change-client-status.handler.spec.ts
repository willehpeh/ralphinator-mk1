import { describe, it, expect, beforeEach } from 'vitest';
import { ChangeClientStatusHandler, ChangeClientStatusCommand } from '@angular-nest-starter/application';
import { ClientAggregate, ClientStatus, DOMAIN_ERRORS } from '@angular-nest-starter/domain';
import { createMockAggregateRepository } from '../lib/mock-factories';
import { ClientAggregateBuilder } from '../lib/builders/client-aggregate.builder';

describe('ChangeClientStatusHandler', () => {
  let handler: ChangeClientStatusHandler;
  let mockAggregateRepository: ReturnType<typeof createMockAggregateRepository>['mockRepository'];
  let getSavedAggregate: ReturnType<typeof createMockAggregateRepository>['getSavedAggregate'];

  beforeEach(() => {
    const mocks = createMockAggregateRepository();
    mockAggregateRepository = mocks.mockRepository;
    getSavedAggregate = mocks.getSavedAggregate;

    handler = new ChangeClientStatusHandler(mockAggregateRepository);
  });

  describe('execute', () => {
    it('should change client status from Prospect to Active', async () => {
      // Arrange
      const existingAggregate = new ClientAggregateBuilder()
        .withId('client-123')
        .withCompanyName('Acme Corporation')
        .withEmail('contact@acme.com')
        .withStatus('Prospect')
        .build();

      mockAggregateRepository.load.mockResolvedValue(existingAggregate);

      const command = new ChangeClientStatusCommand('client-123', 'Active');

      // Act
      const clientId = await handler.execute(command);

      // Assert
      expect(clientId).toBe('client-123');
      expect(mockAggregateRepository.load).toHaveBeenCalledWith('client-123', ClientAggregate);
      expect(mockAggregateRepository.save).toHaveBeenCalledTimes(1);
      expect(getSavedAggregate()).toBeDefined();
      expect(getSavedAggregate().getId()).toBe('client-123');
      expect(getSavedAggregate().getStatus()).toBe('Active');
    });

    it('should change client status from Active to Inactive', async () => {
      // Arrange
      const existingAggregate = new ClientAggregateBuilder()
        .withId('client-456')
        .withCompanyName('Test Company')
        .withEmail('test@example.com')
        .withStatus('Active')
        .build();

      mockAggregateRepository.load.mockResolvedValue(existingAggregate);

      const command = new ChangeClientStatusCommand('client-456', 'Inactive');

      // Act
      const clientId = await handler.execute(command);

      // Assert
      expect(clientId).toBe('client-456');
      expect(getSavedAggregate().getStatus()).toBe('Inactive');
    });

    it('should change client status from Active to Past Client', async () => {
      // Arrange
      const existingAggregate = new ClientAggregateBuilder()
        .withId('client-789')
        .withCompanyName('Old Company')
        .withEmail('old@example.com')
        .withStatus('Active')
        .build();

      mockAggregateRepository.load.mockResolvedValue(existingAggregate);

      const command = new ChangeClientStatusCommand('client-789', 'Past Client');

      // Act
      const clientId = await handler.execute(command);

      // Assert
      expect(clientId).toBe('client-789');
      expect(getSavedAggregate().getStatus()).toBe('Past Client');
    });

    it('should handle all valid status transitions', async () => {
      const statusTransitions: Array<{
        from: ClientStatus;
        to: ClientStatus;
      }> = [
        { from: 'Prospect', to: 'Active' },
        { from: 'Active', to: 'Inactive' },
        { from: 'Inactive', to: 'Active' },
        { from: 'Active', to: 'Past Client' },
        { from: 'Past Client', to: 'Active' },
        { from: 'Prospect', to: 'Inactive' },
      ];

      for (const transition of statusTransitions) {
        const existingAggregate = new ClientAggregateBuilder()
          .withId(`client-${transition.from}-to-${transition.to}`)
          .withCompanyName('Test Company')
          .withEmail('test@example.com')
          .withStatus(transition.from)
          .build();

        mockAggregateRepository.load.mockResolvedValue(existingAggregate);

        const command = new ChangeClientStatusCommand(
          `client-${transition.from}-to-${transition.to}`,
          transition.to
        );

        // Act
        await handler.execute(command);

        // Assert
        expect(getSavedAggregate().getStatus()).toBe(transition.to);

        // Reset for next iteration
        mockAggregateRepository.load.mockClear();
        mockAggregateRepository.save.mockClear();
      }
    });

    it('should persist updated aggregate through repository', async () => {
      // Arrange
      const existingAggregate = new ClientAggregateBuilder()
        .withId('client-persist')
        .withCompanyName('Persistent Company')
        .withEmail('persist@example.com')
        .withStatus('Prospect')
        .build();

      mockAggregateRepository.load.mockResolvedValue(existingAggregate);

      const command = new ChangeClientStatusCommand('client-persist', 'Active');

      // Act
      await handler.execute(command);

      // Assert
      expect(mockAggregateRepository.load).toHaveBeenCalledWith('client-persist', ClientAggregate);
      expect(mockAggregateRepository.save).toHaveBeenCalledTimes(1);
      const savedAggregate = getSavedAggregate();
      expect(savedAggregate).toBe(existingAggregate);
      expect(savedAggregate.getStatus()).toBe('Active');
    });

    it('should throw error when attempting to change to the same status', async () => {
      // Arrange
      const existingAggregate = new ClientAggregateBuilder()
        .withId('client-same-status')
        .withCompanyName('Same Status Company')
        .withEmail('same@example.com')
        .withStatus('Active')
        .build();

      mockAggregateRepository.load.mockResolvedValue(existingAggregate);

      const command = new ChangeClientStatusCommand('client-same-status', 'Active');

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        DOMAIN_ERRORS.CLIENT_STATUS_UNCHANGED
      );
      expect(mockAggregateRepository.load).toHaveBeenCalledWith('client-same-status', ClientAggregate);
      expect(mockAggregateRepository.save).not.toHaveBeenCalled();
    });

    it('should preserve other client properties when changing status', async () => {
      // Arrange
      const existingAggregate = new ClientAggregateBuilder()
        .withId('client-preserve')
        .withCompanyName('Preserve Properties Inc.')
        .withEmail('preserve@example.com')
        .withPhone('+1234567890')
        .withAddress('123 Main St')
        .withStatus('Prospect')
        .withNotes('Important client notes')
        .build();

      mockAggregateRepository.load.mockResolvedValue(existingAggregate);

      const command = new ChangeClientStatusCommand('client-preserve', 'Active');

      // Act
      await handler.execute(command);

      // Assert
      const savedAggregate = getSavedAggregate();
      expect(savedAggregate.getCompanyName()).toBe('Preserve Properties Inc.');
      expect(savedAggregate.getEmail()).toBe('preserve@example.com');
      expect(savedAggregate.getPhone()).toBe('+1234567890');
      expect(savedAggregate.getAddress()).toBe('123 Main St');
      expect(savedAggregate.getStatus()).toBe('Active');
      expect(savedAggregate.getNotes()).toBe('Important client notes');
    });
  });
});
