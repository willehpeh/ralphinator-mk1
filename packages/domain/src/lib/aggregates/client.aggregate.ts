import { EventSourcedAggregate } from '../base/event-sourced-aggregate';
import { DomainEvent } from '../base/domain-event';
import { ClientStatus } from '@angular-nest-starter/shared-types';
import { CLIENT_EVENT_TYPES } from '../constants/client-event-types';
import { DOMAIN_ERRORS } from '../constants/domain-errors';
import { ClientCreatedDomainEvent } from '../events/client-created.domain-event';
import { ClientInformationUpdatedDomainEvent } from '../events/client-information-updated.domain-event';
import { ClientStatusChangedDomainEvent } from '../events/client-status-changed.domain-event';
import { ClientDeletedDomainEvent } from '../events/client-deleted.domain-event';
import { ContactAddedToClientDomainEvent } from '../events/contact-added-to-client.domain-event';
import { ContactUpdatedDomainEvent } from '../events/contact-updated.domain-event';
import { ContactDeletedDomainEvent } from '../events/contact-deleted.domain-event';
import { ClientData } from '../value-objects/client-data.value-object';
import { ContactData } from '../value-objects/contact-data.value-object';
import { Email } from '../value-objects/email.value-object';

/**
 * Represents a contact person associated with a client
 */
export interface Contact {
  contactId: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
}

export class ClientAggregate extends EventSourcedAggregate {
  private id?: string;
  private companyName?: string;
  private email?: Email;
  private phone: string | null = null;
  private address: string | null = null;
  private status?: ClientStatus;
  private notes: string | null = null;
  private contacts: Map<string, Contact> = new Map();

  constructor() {
    super();
    // Register event handlers for all client events
    // Type assertion needed because handlers have heterogeneous event types
    this.registerEventHandlers({
      [CLIENT_EVENT_TYPES.CREATED]: this.onClientCreated.bind(this),
      [CLIENT_EVENT_TYPES.INFORMATION_UPDATED]: this.onClientInformationUpdated.bind(this),
      [CLIENT_EVENT_TYPES.STATUS_CHANGED]: this.onClientStatusChanged.bind(this),
      [CLIENT_EVENT_TYPES.DELETED]: this.onClientDeleted.bind(this),
      [CLIENT_EVENT_TYPES.CONTACT_ADDED]: this.onContactAdded.bind(this),
      [CLIENT_EVENT_TYPES.CONTACT_UPDATED]: this.onContactUpdated.bind(this),
      [CLIENT_EVENT_TYPES.CONTACT_DELETED]: this.onContactDeleted.bind(this),
    } as unknown as Record<string, (event: DomainEvent) => void>);
  }

  /**
   * Factory method to create a new Client aggregate
   *
   * @param id - Unique identifier for the client
   * @param clientData - Value object containing all client information
   * @returns A new ClientAggregate instance with ClientCreatedDomainEvent applied
   */
  static create(
    id: string,
    clientData: ClientData
  ): ClientAggregate {
    const client = new ClientAggregate();
    client.applyEvent(
      new ClientCreatedDomainEvent(id, clientData)
    );
    return client;
  }

  /**
   * Override base ensureInitialized to provide client-specific error message
   */
  protected override ensureInitialized(): string {
    if (!this.id) {
      throw new Error(DOMAIN_ERRORS.CLIENT_NOT_INITIALIZED);
    }
    return this.id;
  }

  /**
   * Gets the current status of the client.
   * This method ensures the aggregate is initialized before returning the status.
   *
   * @throws Error if the aggregate has not been created
   * @returns The current client status
   */
  private getCurrentStatus(): ClientStatus {
    return this.getInitializedField(this.status);
  }

  /**
   * Update client information
   *
   * @param clientData - Value object containing updated client information
   */
  updateInformation(clientData: ClientData): void {
    const id = this.ensureInitialized();

    this.applyEvent(
      new ClientInformationUpdatedDomainEvent(id, clientData)
    );
  }

  /**
   * Change client status
   *
   * @param newStatus - The new status to set for the client
   */
  changeStatus(newStatus: ClientStatus): void {
    const id = this.ensureInitialized();
    const currentStatus = this.getCurrentStatus();

    if (currentStatus === newStatus) {
      throw new Error(DOMAIN_ERRORS.CLIENT_STATUS_UNCHANGED);
    }

    this.applyEvent(
      new ClientStatusChangedDomainEvent(
        id,
        currentStatus,
        newStatus
      )
    );
  }

  /**
   * Delete the client
   * This marks the client as deleted by applying a ClientDeletedDomainEvent
   */
  delete(): void {
    const id = this.ensureInitialized();

    this.applyEvent(
      new ClientDeletedDomainEvent(id)
    );
  }

  /**
   * Add a contact person to this client
   *
   * @param contactData - Value object containing contact information
   * @throws Error if a contact with the same name already exists for this client
   */
  addContact(contactData: ContactData): void {
    const id = this.ensureInitialized();

    // Check for duplicate contact name
    const isDuplicate = Array.from(this.contacts.values()).some(
      contact => contact.name.toLowerCase() === contactData.name.toLowerCase()
    );

    if (isDuplicate) {
      throw new Error(DOMAIN_ERRORS.DUPLICATE_CONTACT_NAME);
    }

    this.applyEvent(
      new ContactAddedToClientDomainEvent(id, contactData)
    );
  }

  /**
   * Update an existing contact's information
   *
   * @param contactData - Value object containing updated contact information
   */
  updateContact(contactData: ContactData): void {
    const id = this.ensureInitialized();

    // Verify contact exists
    if (!this.contacts.has(contactData.contactId)) {
      throw new Error(DOMAIN_ERRORS.CONTACT_NOT_FOUND);
    }

    this.applyEvent(
      new ContactUpdatedDomainEvent(id, contactData)
    );
  }

  /**
   * Remove a contact person from this client
   *
   * @param contactId - Unique identifier for the contact to remove
   */
  removeContact(contactId: string): void {
    const id = this.ensureInitialized();

    // Verify contact exists
    if (!this.contacts.has(contactId)) {
      throw new Error(DOMAIN_ERRORS.CONTACT_NOT_FOUND);
    }

    this.applyEvent(
      new ContactDeletedDomainEvent(id, contactId)
    );
  }

  /**
   * Helper method to update client fields from ClientData value object
   * Used by event handlers to apply state changes consistently
   *
   * @param clientData - Value object containing client information
   */
  private updateClientFields(clientData: ClientData): void {
    this.companyName = clientData.companyName;
    this.email = clientData.email;
    this.phone = clientData.phone;
    this.address = clientData.address;
    this.status = clientData.status;
    this.notes = clientData.notes;
  }

  /**
   * Event handler for ClientCreatedDomainEvent
   * Initializes the aggregate state when a new client is created
   */
  private onClientCreated(event: ClientCreatedDomainEvent): void {
    this.id = event.aggregateId;
    this.updateClientFields(event.clientData);
  }

  /**
   * Event handler for ClientInformationUpdatedDomainEvent
   * Updates the aggregate state when client information changes
   */
  private onClientInformationUpdated(event: ClientInformationUpdatedDomainEvent): void {
    this.updateClientFields(event.clientData);
  }

  /**
   * Event handler for ClientStatusChangedDomainEvent
   * Updates the aggregate state when client status changes
   */
  private onClientStatusChanged(event: ClientStatusChangedDomainEvent): void {
    this.status = event.newStatus;
  }

  /**
   * Event handler for ClientDeletedDomainEvent
   * Marks the aggregate as deleted (state is preserved for event replay)
   */
  private onClientDeleted(): void {
    // Mark aggregate as deleted - state is preserved for event replay
    // The aggregate maintains its ID but is logically deleted
  }

  /**
   * Maps ContactData value object to Contact interface
   * Extracts repeated mapping logic used by contact event handlers
   */
  private mapContactDataToContact(contactData: ContactData): Contact {
    return {
      contactId: contactData.contactId,
      name: contactData.name,
      role: contactData.role,
      email: contactData.email,
      phone: contactData.phone,
    };
  }

  /**
   * Event handler for ContactAddedToClientDomainEvent
   * Adds a contact to the client's contacts map
   */
  private onContactAdded(event: ContactAddedToClientDomainEvent): void {
    this.contacts.set(
      event.contactData.contactId,
      this.mapContactDataToContact(event.contactData)
    );
  }

  /**
   * Event handler for ContactUpdatedDomainEvent
   * Updates an existing contact in the client's contacts map
   */
  private onContactUpdated(event: ContactUpdatedDomainEvent): void {
    this.contacts.set(
      event.contactData.contactId,
      this.mapContactDataToContact(event.contactData)
    );
  }

  /**
   * Event handler for ContactDeletedDomainEvent
   * Removes a contact from the client's contacts map
   */
  private onContactDeleted(event: ContactDeletedDomainEvent): void {
    this.contacts.delete(event.contactId);
  }

  // Getters for accessing aggregate state
  // All getters ensure the aggregate is initialized before returning values
  getId(): string {
    return this.ensureInitialized();
  }

  getCompanyName(): string {
    return this.getInitializedField(this.companyName);
  }

  getEmail(): Email {
    return this.getInitializedField(this.email);
  }

  getPhone(): string | null {
    return this.getInitializedField(this.phone);
  }

  getAddress(): string | null {
    return this.getInitializedField(this.address);
  }

  getStatus(): ClientStatus {
    return this.getInitializedField(this.status);
  }

  getNotes(): string | null {
    return this.getInitializedField(this.notes);
  }

  /**
   * Get all contacts associated with this client
   * Returns a copy of the contacts array to prevent external mutation
   */
  getContacts(): Contact[] {
    this.ensureInitialized();
    return Array.from(this.contacts.values());
  }
}
