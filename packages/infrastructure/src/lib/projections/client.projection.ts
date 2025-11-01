import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { ClientCreatedDomainEvent } from '@angular-nest-starter/domain';
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
 * - Subscribes to ClientCreatedDomainEvent from the event store
 * - Transforms domain events into ClientReadModel DTOs
 * - Persists read models to the read repository (optimized for queries)
 * - Enables separation of write (event store) and read (read model) data stores
 */
@Injectable()
@EventsHandler(ClientCreatedDomainEvent)
export class ClientProjection implements IEventHandler<ClientCreatedDomainEvent> {
  constructor(
    @Inject('IClientReadRepository')
    private readonly clientReadRepository: IClientReadRepository
  ) {}

  /**
   * Handles ClientCreatedDomainEvent by creating/updating the read model
   *
   * @param event - The domain event from the event store
   */
  async handle(event: ClientCreatedDomainEvent): Promise<void> {
    // Transform domain event into read model
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
}
