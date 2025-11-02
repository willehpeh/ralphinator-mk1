import { EventsHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import {
  ClientCreatedDomainEvent,
  ClientInformationUpdatedDomainEvent,
  ClientStatusChangedDomainEvent,
  ClientDeletedDomainEvent,
  CLIENT_EVENT_TYPES
} from '@angular-nest-starter/domain';
import {
  IClientReadRepository,
  ClientReadModel,
  INJECTION_TOKENS,
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
    @Inject(INJECTION_TOKENS.CLIENT_READ_REPOSITORY)
    private readonly clientReadRepository: IClientReadRepository
  ) {
    super();
    // Register event handlers for all client events using helper method
    this.registerEventHandlers({
      [CLIENT_EVENT_TYPES.CREATED]: this.onClientCreated.bind(this),
      [CLIENT_EVENT_TYPES.INFORMATION_UPDATED]: this.onClientInformationUpdated.bind(this),
      [CLIENT_EVENT_TYPES.STATUS_CHANGED]: this.onClientStatusChanged.bind(this),
      [CLIENT_EVENT_TYPES.DELETED]: this.onClientDeleted.bind(this),
    });
  }

  /**
   * Helper method to update an existing read model.
   * Fetches the existing read model, applies the update function, and saves it.
   * Consolidates the common "fetch-update-save" pattern across event handlers.
   *
   * @param aggregateId - The client aggregate ID
   * @param updater - Function that transforms the existing read model into the updated version
   */
  private async updateReadModel(
    aggregateId: string,
    updater: (existing: ClientReadModel | null) => ClientReadModel | null
  ): Promise<void> {
    const existing = await this.clientReadRepository.findById(aggregateId);
    const updated = updater(existing);

    if (updated) {
      await this.clientReadRepository.save(updated);
    }
  }

  /**
   * Helper method to transform ClientData and metadata into a ClientReadModel.
   * Eliminates duplication between create and update event handlers.
   *
   * @param aggregateId - The client aggregate ID
   * @param clientData - The client data from the domain event
   * @param createdAt - The timestamp when the client was created
   * @returns ClientReadModel for persistence
   */
  private transformToReadModel(
    aggregateId: string,
    clientData: ClientCreatedDomainEvent['clientData'],
    createdAt: Date
  ): ClientReadModel {
    return {
      id: aggregateId,
      companyName: clientData.companyName,
      email: clientData.email?.getValue() ?? null,
      phone: clientData.phone,
      address: clientData.address,
      status: clientData.status,
      notes: clientData.notes,
      createdAt,
    };
  }

  /**
   * Event handler for ClientCreatedDomainEvent
   * Creates a new read model when a client is created
   */
  private async onClientCreated(event: ClientCreatedDomainEvent): Promise<void> {
    // Transform ClientCreatedDomainEvent into read model using helper
    const readModel = this.transformToReadModel(
      event.aggregateId,
      event.clientData,
      event.occurredOn
    );

    // Persist to read repository
    await this.clientReadRepository.save(readModel);
  }

  /**
   * Event handler for ClientInformationUpdatedDomainEvent
   * Updates the read model when client information changes
   */
  private async onClientInformationUpdated(event: ClientInformationUpdatedDomainEvent): Promise<void> {
    return this.updateReadModel(event.aggregateId, (existing) =>
      this.transformToReadModel(
        event.aggregateId,
        event.clientData,
        existing?.createdAt ?? event.occurredOn // Preserve original createdAt
      )
    );
  }

  /**
   * Event handler for ClientStatusChangedDomainEvent
   * Updates only the status field in the read model
   */
  private async onClientStatusChanged(event: ClientStatusChangedDomainEvent): Promise<void> {
    return this.updateReadModel(event.aggregateId, (existing) =>
      existing ? { ...existing, status: event.newStatus } : null
    );
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
