import { EventsHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import {
  ContactAddedToClientDomainEvent,
  CLIENT_EVENT_TYPES
} from '@angular-nest-starter/domain';
import {
  IContactReadRepository,
  ContactReadModel,
  INJECTION_TOKENS,
} from '@angular-nest-starter/application';
import { BaseProjectionHandler } from '../base/base-projection.handler';

/**
 * ContactProjection
 *
 * Infrastructure layer projection that listens to contact-related domain events
 * and builds optimized read models for the CQRS query side.
 *
 * This projection:
 * - Subscribes to ContactAddedToClientDomainEvent from the event store
 * - Transforms domain events into ContactReadModel DTOs
 * - Persists read models to the read repository (optimized for queries)
 * - Enables separation of write (event store) and read (read model) data stores
 * - Uses the event handler registry pattern for extensible event handling
 */
@Injectable()
@EventsHandler(ContactAddedToClientDomainEvent)
export class ContactProjection extends BaseProjectionHandler {
  constructor(
    @Inject(INJECTION_TOKENS.CONTACT_READ_REPOSITORY)
    private readonly contactReadRepository: IContactReadRepository
  ) {
    super();
    // Register event handlers for all contact events using helper method
    this.registerEventHandlers({
      [CLIENT_EVENT_TYPES.CONTACT_ADDED]: this.onContactAdded.bind(this),
    });
  }

  /**
   * Event handler for ContactAddedToClientDomainEvent
   * Creates a new contact read model when a contact is added to a client
   */
  private async onContactAdded(event: ContactAddedToClientDomainEvent): Promise<void> {
    // Transform ContactAddedToClientDomainEvent into contact read model
    // Note: clientName is set to empty string as it will be populated by the repository when fetching
    const readModel = new ContactReadModel(
      event.contactId,
      event.aggregateId, // clientId is the aggregateId
      '', // clientName will be populated by repository on read
      event.name,
      event.role,
      event.email,
      event.phone
    );

    // Persist to read repository
    await this.contactReadRepository.save(readModel);
  }
}
