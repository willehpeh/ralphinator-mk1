import { EventsHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import {
  ContactAddedToClientDomainEvent,
  ContactUpdatedDomainEvent,
  ContactDeletedDomainEvent,
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
 * - Subscribes to ContactAddedToClientDomainEvent, ContactUpdatedDomainEvent, and ContactDeletedDomainEvent from the event store
 * - Transforms domain events into ContactReadModel DTOs
 * - Persists read models to the read repository (optimized for queries)
 * - Enables separation of write (event store) and read (read model) data stores
 * - Uses the event handler registry pattern for extensible event handling
 */
@Injectable()
@EventsHandler(ContactAddedToClientDomainEvent, ContactUpdatedDomainEvent, ContactDeletedDomainEvent)
export class ContactProjection extends BaseProjectionHandler {
  constructor(
    @Inject(INJECTION_TOKENS.CONTACT_READ_REPOSITORY)
    private readonly contactReadRepository: IContactReadRepository
  ) {
    super();
    // Register event handlers for all contact events using helper method
    this.registerEventHandlers({
      [CLIENT_EVENT_TYPES.CONTACT_ADDED]: this.onContactAdded.bind(this),
      [CLIENT_EVENT_TYPES.CONTACT_UPDATED]: this.onContactUpdated.bind(this),
      [CLIENT_EVENT_TYPES.CONTACT_DELETED]: this.onContactDeleted.bind(this),
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
      event.contactData.contactId,
      event.aggregateId, // clientId is the aggregateId
      '', // clientName will be populated by repository on read
      event.contactData.name,
      event.contactData.role,
      event.contactData.email,
      event.contactData.phone
    );

    // Persist to read repository
    await this.contactReadRepository.save(readModel);
  }

  /**
   * Event handler for ContactUpdatedDomainEvent
   * Updates an existing contact read model when contact information is modified
   */
  private async onContactUpdated(event: ContactUpdatedDomainEvent): Promise<void> {
    // Fetch the existing contact read model
    const existingContact = await this.contactReadRepository.findById(event.contactData.contactId);

    if (!existingContact) {
      // If contact doesn't exist in read model, log warning but don't fail
      // This could happen if events are processed out of order
      console.warn(`Contact ${event.contactData.contactId} not found in read model during update`);
      return;
    }

    // Transform ContactUpdatedDomainEvent into updated contact read model
    // Preserve clientId and clientName from existing read model
    const updatedReadModel = new ContactReadModel(
      event.contactData.contactId,
      existingContact.clientId,
      existingContact.clientName,
      event.contactData.name,
      event.contactData.role,
      event.contactData.email,
      event.contactData.phone
    );

    // Persist updated read model to repository
    await this.contactReadRepository.save(updatedReadModel);
  }

  /**
   * Event handler for ContactDeletedDomainEvent
   * Removes a contact read model when a contact is deleted from a client
   */
  private async onContactDeleted(event: ContactDeletedDomainEvent): Promise<void> {
    // Delete the contact from the read repository
    await this.contactReadRepository.delete(event.contactId);
  }
}
