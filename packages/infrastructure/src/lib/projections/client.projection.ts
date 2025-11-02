import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { ClientCreatedDomainEvent, ClientInformationUpdatedDomainEvent, ClientStatusChangedDomainEvent } from '@angular-nest-starter/domain';
import {
  IClientReadRepository,
  ClientReadModel
} from '@angular-nest-starter/application';

/**
 * ClientProjection
 *
 * Infrastructure layer projection that listens to domain events and builds
 * optimized read models for the CQRS query side.
 *
 * This projection:
 * - Subscribes to ClientCreatedDomainEvent, ClientInformationUpdatedDomainEvent, and ClientStatusChangedDomainEvent from the event store
 * - Transforms domain events into ClientReadModel DTOs
 * - Persists read models to the read repository (optimized for queries)
 * - Enables separation of write (event store) and read (read model) data stores
 */
@Injectable()
@EventsHandler(ClientCreatedDomainEvent, ClientInformationUpdatedDomainEvent, ClientStatusChangedDomainEvent)
export class ClientProjection implements IEventHandler<ClientCreatedDomainEvent | ClientInformationUpdatedDomainEvent | ClientStatusChangedDomainEvent> {
  constructor(
    @Inject('IClientReadRepository')
    private readonly clientReadRepository: IClientReadRepository
  ) {}

  /**
   * Handles domain events by creating/updating the read model
   *
   * @param event - The domain event from the event store
   */
  async handle(event: ClientCreatedDomainEvent | ClientInformationUpdatedDomainEvent | ClientStatusChangedDomainEvent): Promise<void> {
    if (event instanceof ClientCreatedDomainEvent) {
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
    } else if (event instanceof ClientInformationUpdatedDomainEvent) {
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
    } else if (event instanceof ClientStatusChangedDomainEvent) {
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
  }
}
