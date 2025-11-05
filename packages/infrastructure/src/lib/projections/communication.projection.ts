import { EventsHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import {
  CommunicationCreatedDomainEvent,
  COMMUNICATION_EVENT_TYPES
} from '@angular-nest-starter/domain';
import {
  ICommunicationReadRepository,
  CommunicationReadModel,
  INJECTION_TOKENS,
} from '@angular-nest-starter/application';
import { BaseProjectionHandler } from '../base/base-projection.handler';

/**
 * CommunicationProjection
 *
 * Infrastructure layer projection that listens to communication-related domain events
 * and builds optimized read models for the CQRS query side.
 *
 * This projection:
 * - Subscribes to CommunicationCreatedDomainEvent from the event store
 * - Transforms domain events into CommunicationReadModel DTOs
 * - Persists read models to the read repository (optimized for queries)
 * - Enables separation of write (event store) and read (read model) data stores
 * - Uses the event handler registry pattern for extensible event handling
 */
@Injectable()
@EventsHandler(CommunicationCreatedDomainEvent)
export class CommunicationProjection extends BaseProjectionHandler {
  constructor(
    @Inject(INJECTION_TOKENS.COMMUNICATION_READ_REPOSITORY)
    private readonly communicationReadRepository: ICommunicationReadRepository
  ) {
    super();
    // Register event handlers for communication events using helper method
    this.registerEventHandlers({
      [COMMUNICATION_EVENT_TYPES.CREATED]: this.onCommunicationCreated.bind(this),
    });
  }

  /**
   * Event handler for CommunicationCreatedDomainEvent
   * Creates a new communication read model when a communication is created
   */
  private async onCommunicationCreated(event: CommunicationCreatedDomainEvent): Promise<void> {
    // Transform CommunicationCreatedDomainEvent into communication read model
    // Note: clientName, contactName, and projectName are set to empty string/null
    // as they will be populated by the repository when fetching (denormalized data)
    const now = event.occurredOn;
    const readModel = new CommunicationReadModel(
      event.aggregateId,
      event.communicationData.type,
      event.communicationData.subject,
      event.communicationData.communicationDate,
      null, // duration - not set in creation event
      event.communicationData.notes,
      event.communicationData.clientId,
      '', // clientName will be populated by repository on read
      event.communicationData.contactId,
      event.communicationData.contactId ? '' : null, // contactName will be populated by repository on read (if contactId exists)
      event.communicationData.projectId,
      event.communicationData.projectId ? '' : null, // projectName will be populated by repository on read (if projectId exists)
      event.communicationData.followUpRequired,
      event.communicationData.followUpDate,
      false, // followUpCompleted - defaults to false on creation
      now, // createdAt
      now  // updatedAt
    );

    // Persist to read repository
    await this.communicationReadRepository.save(readModel);
  }
}
