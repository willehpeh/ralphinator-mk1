import { EventsHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { ClientCreatedDomainEvent, ClientInformationUpdatedDomainEvent, ClientStatusChangedDomainEvent, ClientDeletedDomainEvent } from '@angular-nest-starter/domain';
import {
  IClientReadRepository,
  ClientReadModel
} from '@angular-nest-starter/application';
import { BaseProjectionHandler } from '../base/base-projection.handler';

/**
 * ClientProjection
 *
 * Infrastructure layer projection that listens to domain events and builds
 * optimized read models for the CQRS query side.
 *
 * This projection:
 * - Subscribes to ClientCreatedDomainEvent, ClientInformationUpdatedDomainEvent, ClientStatusChangedDomainEvent, and ClientDeletedDomainEvent from the event store
 * - Transforms domain events into ClientReadModel DTOs
 * - Persists read models to the read repository (optimized for queries)
 * - Enables separation of write (event store) and read (read model) data stores
 * - Uses the event handler registry pattern for extensible event handling
 */
@Injectable()
@EventsHandler(ClientCreatedDomainEvent, ClientInformationUpdatedDomainEvent, ClientStatusChangedDomainEvent, ClientDeletedDomainEvent)
export class ClientProjection extends BaseProjectionHandler {
  constructor(
    @Inject('IClientReadRepository')
    private readonly clientReadRepository: IClientReadRepository
  ) {
    super();
    // Register event handlers for all client events
    this.registerEventHandler('ClientCreatedDomainEvent', this.onClientCreated.bind(this));
    this.registerEventHandler('ClientInformationUpdatedDomainEvent', this.onClientInformationUpdated.bind(this));
    this.registerEventHandler('ClientStatusChangedDomainEvent', this.onClientStatusChanged.bind(this));
    this.registerEventHandler('ClientDeletedDomainEvent', this.onClientDeleted.bind(this));
  }

  /**
   * Event handler for ClientCreatedDomainEvent
   * Creates a new read model when a client is created
   */
  private async onClientCreated(event: ClientCreatedDomainEvent): Promise<void> {
    // Transform ClientCreatedDomainEvent into read model
    const readModel: ClientReadModel = {
      id: event.aggregateId,
      companyName: event.companyName,
      email: event.email,
      phone: event.phone,
      address: event.address,
      status: event.status,
      notes: event.notes,
      createdAt: event.occurredOn,
    };

    // Persist to read repository
    await this.clientReadRepository.save(readModel);
  }

  /**
   * Event handler for ClientInformationUpdatedDomainEvent
   * Updates the read model when client information changes
   */
  private async onClientInformationUpdated(event: ClientInformationUpdatedDomainEvent): Promise<void> {
    // Fetch the existing read model to preserve createdAt timestamp
    const existingReadModel = await this.clientReadRepository.findById(event.aggregateId);

    // Transform ClientInformationUpdatedDomainEvent into read model
    const readModel: ClientReadModel = {
      id: event.aggregateId,
      companyName: event.companyName,
      email: event.email,
      phone: event.phone,
      address: event.address,
      status: event.status,
      notes: event.notes,
      createdAt: existingReadModel?.createdAt || event.occurredOn, // Preserve original createdAt
    };

    // Update the read repository
    await this.clientReadRepository.save(readModel);
  }

  /**
   * Event handler for ClientStatusChangedDomainEvent
   * Updates only the status field in the read model
   */
  private async onClientStatusChanged(event: ClientStatusChangedDomainEvent): Promise<void> {
    // Fetch the existing read model
    const existingReadModel = await this.clientReadRepository.findById(event.aggregateId);

    if (existingReadModel) {
      // Update only the status field
      const updatedReadModel: ClientReadModel = {
        ...existingReadModel,
        status: event.newStatus,
      };

      // Persist the updated read model
      await this.clientReadRepository.save(updatedReadModel);
    }
  }

  /**
   * Event handler for ClientDeletedDomainEvent
   * Removes the client from the read model
   */
  private async onClientDeleted(event: ClientDeletedDomainEvent): Promise<void> {
    // Remove the client from the read model
    await this.clientReadRepository.delete(event.aggregateId);
  }
}
