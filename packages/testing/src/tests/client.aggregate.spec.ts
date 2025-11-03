import { describe, it, expect, beforeEach } from 'vitest';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { ClientData } from '@angular-nest-starter/domain';
import { Email } from '@angular-nest-starter/domain';
import { ClientStatus } from '@angular-nest-starter/shared-types';
import { ClientCreatedDomainEvent } from '@angular-nest-starter/domain';
import { ClientInformationUpdatedDomainEvent } from '@angular-nest-starter/domain';
import { ClientStatusChangedDomainEvent } from '@angular-nest-starter/domain';
import { ClientDeletedDomainEvent } from '@angular-nest-starter/domain';
import { DOMAIN_ERRORS } from '@angular-nest-starter/domain';
import { expectAggregateToMatch, ALL_CLIENT_STATUSES } from '../lib/test-assertions';

describe('ClientAggregate', () => {
  let clientData: ClientData;

  beforeEach(() => {
    // Setup test data
    clientData = ClientData.fromPayload({
      companyName: 'Acme Corporation',
      email: Email.create('contact@acme.com'),
      phone: '+1234567890',
      address: '123 Main St',
      status: 'Active' as ClientStatus,
      notes: 'Important client'
    });
  });

  describe('create', () => {
    it('should create a new client aggregate with correct initial state', () => {
      // Act
      const client = ClientAggregate.create('client-123', clientData);

      // Assert
      expectAggregateToMatch(client, {
        id: 'client-123',
        companyName: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1234567890',
        address: '123 Main St',
        status: 'Active',
        notes: 'Important client'
      });
    });

    it('should create aggregate with optional fields as null', () => {
      // Arrange
      const minimalData = ClientData.fromPayload({
        companyName: 'Beta Inc',
        email: Email.create('info@beta.com'),
        phone: null,
        address: null,
        status: 'Prospect' as ClientStatus,
        notes: null
      });

      // Act
      const client = ClientAggregate.create('client-456', minimalData);

      // Assert
      expectAggregateToMatch(client, {
        id: 'client-456',
        companyName: 'Beta Inc',
        email: 'info@beta.com',
        phone: null,
        address: null,
        status: 'Prospect',
        notes: null
      });
    });

    it('should apply ClientCreatedDomainEvent', () => {
      // Act
      const client = ClientAggregate.create('client-789', clientData);
      const uncommittedEvents = client.getUncommittedEvents();

      // Assert
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(ClientCreatedDomainEvent);
      expect(uncommittedEvents[0].aggregateId).toBe('client-789');
      expect((uncommittedEvents[0] as ClientCreatedDomainEvent).clientData).toBe(clientData);
    });

    it('should create aggregate with all valid client statuses', () => {
      ALL_CLIENT_STATUSES.forEach(status => {
        // Arrange
        const data = ClientData.fromPayload({
          companyName: 'Test Company',
          email: Email.create('test@test.com'),
          phone: null,
          address: null,
          status,
          notes: null
        });

        // Act
        const client = ClientAggregate.create(`client-${status}`, data);

        // Assert
        expect(client.getStatus()).toBe(status);
      });
    });
  });

  describe('updateInformation', () => {
    it('should update client information and apply event', () => {
      // Arrange
      const client = ClientAggregate.create('client-123', clientData);
      client.markEventsAsCommitted(); // Clear initial events

      const updatedData = ClientData.fromPayload({
        companyName: 'Acme Corp Updated',
        email: Email.create('newemail@acme.com'),
        phone: '+9999999999',
        address: '456 New St',
        status: 'Active' as ClientStatus,
        notes: 'Updated notes'
      });

      // Act
      client.updateInformation(updatedData);

      // Assert
      expectAggregateToMatch(client, {
        id: 'client-123',
        companyName: 'Acme Corp Updated',
        email: 'newemail@acme.com',
        phone: '+9999999999',
        address: '456 New St',
        status: 'Active',
        notes: 'Updated notes'
      });

      const uncommittedEvents = client.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(ClientInformationUpdatedDomainEvent);
      expect((uncommittedEvents[0] as ClientInformationUpdatedDomainEvent).clientData).toBe(updatedData);
    });

    it('should allow updating only some fields', () => {
      // Arrange
      const client = ClientAggregate.create('client-123', clientData);
      client.markEventsAsCommitted();

      const partialUpdate = ClientData.fromPayload({
        companyName: 'New Company Name',
        email: Email.create('contact@acme.com'), // Same email
        phone: clientData.phone, // Same phone
        address: clientData.address, // Same address
        status: clientData.status, // Same status
        notes: clientData.notes // Same notes
      });

      // Act
      client.updateInformation(partialUpdate);

      // Assert
      expect(client.getCompanyName()).toBe('New Company Name');
      expect(client.getEmail()?.getValue()).toBe('contact@acme.com');
    });

    it('should throw error when updating uninitialized aggregate', () => {
      // Arrange
      const uninitializedClient = new ClientAggregate();

      // Act & Assert
      expect(() => uninitializedClient.updateInformation(clientData))
        .toThrow(DOMAIN_ERRORS.CLIENT_NOT_INITIALIZED);
    });
  });

  describe('changeStatus', () => {
    it('should change client status from Active to Inactive', () => {
      // Arrange
      const client = ClientAggregate.create('client-123', clientData);
      client.markEventsAsCommitted();

      // Act
      client.changeStatus('Inactive');

      // Assert
      expect(client.getStatus()).toBe('Inactive');

      const uncommittedEvents = client.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(ClientStatusChangedDomainEvent);

      const statusEvent = uncommittedEvents[0] as ClientStatusChangedDomainEvent;
      expect(statusEvent.previousStatus).toBe('Active');
      expect(statusEvent.newStatus).toBe('Inactive');
    });

    it('should allow all valid status transitions', () => {
      const transitions: Array<[ClientStatus, ClientStatus]> = [
        ['Active', 'Inactive'],
        ['Active', 'Prospect'],
        ['Active', 'Past Client'],
        ['Inactive', 'Active'],
        ['Prospect', 'Active'],
        ['Past Client', 'Active']
      ];

      transitions.forEach(([fromStatus, toStatus]) => {
        // Arrange
        const data = ClientData.fromPayload({
          companyName: 'Test Co',
          email: Email.create('test@test.com'),
          phone: null,
          address: null,
          status: fromStatus,
          notes: null
        });
        const client = ClientAggregate.create(`client-${fromStatus}-${toStatus}`, data);
        client.markEventsAsCommitted();

        // Act
        client.changeStatus(toStatus);

        // Assert
        expect(client.getStatus()).toBe(toStatus);
      });
    });

    it('should throw error when changing to same status', () => {
      // Arrange
      const client = ClientAggregate.create('client-123', clientData);

      // Act & Assert
      expect(() => client.changeStatus('Active'))
        .toThrow(DOMAIN_ERRORS.CLIENT_STATUS_UNCHANGED);
    });

    it('should throw error when status is not initialized', () => {
      // Arrange
      const uninitializedClient = new ClientAggregate();

      // Act & Assert
      expect(() => uninitializedClient.changeStatus('Active'))
        .toThrow(DOMAIN_ERRORS.CLIENT_NOT_INITIALIZED);
    });

    it('should throw error when changing uninitialized aggregate', () => {
      // Arrange
      const uninitializedClient = new ClientAggregate();

      // Act & Assert
      expect(() => uninitializedClient.changeStatus('Active'))
        .toThrow(DOMAIN_ERRORS.CLIENT_NOT_INITIALIZED);
    });
  });

  describe('delete', () => {
    it('should mark client as deleted and apply event', () => {
      // Arrange
      const client = ClientAggregate.create('client-123', clientData);
      client.markEventsAsCommitted();

      // Act
      client.delete();

      // Assert - State is preserved after deletion
      expect(client.getId()).toBe('client-123');
      expect(client.getCompanyName()).toBe('Acme Corporation');

      const uncommittedEvents = client.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(ClientDeletedDomainEvent);
      expect(uncommittedEvents[0].aggregateId).toBe('client-123');
    });

    it('should throw error when deleting uninitialized aggregate', () => {
      // Arrange
      const uninitializedClient = new ClientAggregate();

      // Act & Assert
      expect(() => uninitializedClient.delete())
        .toThrow(DOMAIN_ERRORS.CLIENT_NOT_INITIALIZED);
    });

    it('should allow multiple operations before deletion', () => {
      // Arrange
      const client = ClientAggregate.create('client-123', clientData);
      client.markEventsAsCommitted();

      // Act
      client.changeStatus('Inactive');
      client.markEventsAsCommitted();

      const updatedData = ClientData.fromPayload({
        companyName: 'Updated Name',
        email: Email.create('new@acme.com'),
        phone: null,
        address: null,
        status: 'Inactive' as ClientStatus,
        notes: null
      });
      client.updateInformation(updatedData);
      client.markEventsAsCommitted();

      client.delete();

      // Assert
      expect(client.getCompanyName()).toBe('Updated Name');
      expect(client.getStatus()).toBe('Inactive');

      const uncommittedEvents = client.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(ClientDeletedDomainEvent);
    });
  });

  describe('event replay (event sourcing)', () => {
    it('should rebuild aggregate state from event history', () => {
      // Arrange
      const client = new ClientAggregate();
      const events = [
        new ClientCreatedDomainEvent('client-123', clientData, 1),
        new ClientStatusChangedDomainEvent('client-123', 'Active', 'Inactive', 1),
      ];

      // Act
      client.loadFromHistory(events);

      // Assert
      expectAggregateToMatch(client, {
        id: 'client-123',
        companyName: 'Acme Corporation',
        email: 'contact@acme.com',
        status: 'Inactive' // Status changed to Inactive
      });
    });

    it('should rebuild complex event history correctly', () => {
      // Arrange
      const client = new ClientAggregate();

      const updatedData = ClientData.fromPayload({
        companyName: 'Acme Corp v2',
        email: Email.create('updated@acme.com'),
        phone: '+1111111111',
        address: '789 Final St',
        status: 'Prospect' as ClientStatus,
        notes: 'Final notes'
      });

      const events = [
        new ClientCreatedDomainEvent('client-123', clientData, 1),
        new ClientStatusChangedDomainEvent('client-123', 'Active', 'Inactive', 1),
        new ClientStatusChangedDomainEvent('client-123', 'Inactive', 'Prospect', 1),
        new ClientInformationUpdatedDomainEvent('client-123', updatedData, 1),
        new ClientDeletedDomainEvent('client-123', 1),
      ];

      // Act
      client.loadFromHistory(events);

      // Assert - All changes applied in order
      expectAggregateToMatch(client, {
        id: 'client-123',
        companyName: 'Acme Corp v2',
        email: 'updated@acme.com',
        phone: '+1111111111',
        address: '789 Final St',
        status: 'Prospect',
        notes: 'Final notes'
      });
    });

    it('should maintain event order during replay', () => {
      // Arrange
      const client = new ClientAggregate();

      const firstUpdate = ClientData.fromPayload({
        companyName: 'First Update',
        email: Email.create('first@test.com'),
        phone: null,
        address: null,
        status: 'Active' as ClientStatus,
        notes: null
      });

      const secondUpdate = ClientData.fromPayload({
        companyName: 'Second Update',
        email: Email.create('second@test.com'),
        phone: null,
        address: null,
        status: 'Active' as ClientStatus,
        notes: null
      });

      const events = [
        new ClientCreatedDomainEvent('client-123', clientData, 1),
        new ClientInformationUpdatedDomainEvent('client-123', firstUpdate, 1),
        new ClientInformationUpdatedDomainEvent('client-123', secondUpdate, 1),
      ];

      // Act
      client.loadFromHistory(events);

      // Assert - Should have final state from last update
      expect(client.getCompanyName()).toBe('Second Update');
      expect(client.getEmail()?.getValue()).toBe('second@test.com');
    });

    it('should not have uncommitted events after loading from history', () => {
      // Arrange
      const client = new ClientAggregate();
      const events = [
        new ClientCreatedDomainEvent('client-123', clientData, 1),
      ];

      // Act
      client.loadFromHistory(events);

      // Assert
      expect(client.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('getters', () => {
    it('should return correct values for all getters', () => {
      // Arrange & Act
      const client = ClientAggregate.create('client-123', clientData);

      // Assert
      expect(client.getId()).toBe('client-123');
      expect(client.getCompanyName()).toBe('Acme Corporation');
      expect(client.getEmail()).toBeInstanceOf(Email);
      expect(client.getEmail()?.getValue()).toBe('contact@acme.com');
      expect(client.getPhone()).toBe('+1234567890');
      expect(client.getAddress()).toBe('123 Main St');
      expect(client.getStatus()).toBe('Active');
      expect(client.getNotes()).toBe('Important client');
    });

    it('should return undefined for uninitialized optional fields', () => {
      // Arrange
      const uninitializedClient = new ClientAggregate();

      // Assert
      expect(uninitializedClient.getCompanyName()).toBeUndefined();
      expect(uninitializedClient.getEmail()).toBeUndefined();
      expect(uninitializedClient.getPhone()).toBeUndefined();
      expect(uninitializedClient.getAddress()).toBeUndefined();
      expect(uninitializedClient.getStatus()).toBeUndefined();
      expect(uninitializedClient.getNotes()).toBeUndefined();
    });

    it('should throw when getId called on uninitialized aggregate', () => {
      // Arrange
      const uninitializedClient = new ClientAggregate();

      // Act & Assert
      expect(() => uninitializedClient.getId())
        .toThrow(DOMAIN_ERRORS.CLIENT_NOT_INITIALIZED);
    });
  });

  describe('event versioning', () => {
    it('should create events with version 1 by default', () => {
      // Act
      const client = ClientAggregate.create('client-123', clientData);
      const events = client.getUncommittedEvents();

      // Assert
      expect(events[0].eventVersion).toBe(1);
    });

    it('should maintain event version during replay', () => {
      // Arrange
      const client = new ClientAggregate();
      const event = new ClientCreatedDomainEvent('client-123', clientData, 2); // Version 2

      // Act
      client.loadFromHistory([event]);

      // Assert - Should handle different event versions
      expect(client.getId()).toBe('client-123');
    });
  });
});
