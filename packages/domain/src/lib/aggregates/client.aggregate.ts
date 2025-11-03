import { EventSourcedAggregate } from '../base/event-sourced-aggregate';
import { DomainEvent } from '../base/domain-event';
import { ClientStatus } from '@angular-nest-starter/shared-types';
import { CLIENT_EVENT_TYPES } from '../constants/client-event-types';
import { DOMAIN_ERRORS } from '../constants/domain-errors';
import { ClientCreatedDomainEvent } from '../events/client-created.domain-event';
import { ClientInformationUpdatedDomainEvent } from '../events/client-information-updated.domain-event';
import { ClientStatusChangedDomainEvent } from '../events/client-status-changed.domain-event';
import { ClientDeletedDomainEvent } from '../events/client-deleted.domain-event';
import { ClientData } from '../value-objects/client-data.value-object';
import { Email } from '../value-objects/email.value-object';

export class ClientAggregate extends EventSourcedAggregate {
  private id?: string;
  private companyName?: string;
  private email?: Email;
  private phone: string | null = null;
  private address: string | null = null;
  private status?: ClientStatus;
  private notes: string | null = null;

  constructor() {
    super();
    // Register event handlers for all client events
    // Type assertion needed because handlers have heterogeneous event types
    this.registerEventHandlers({
      [CLIENT_EVENT_TYPES.CREATED]: this.onClientCreated.bind(this),
      [CLIENT_EVENT_TYPES.INFORMATION_UPDATED]: this.onClientInformationUpdated.bind(this),
      [CLIENT_EVENT_TYPES.STATUS_CHANGED]: this.onClientStatusChanged.bind(this),
      [CLIENT_EVENT_TYPES.DELETED]: this.onClientDeleted.bind(this),
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
   * Ensures that the aggregate has been initialized (created).
   * Throws an error if the aggregate ID is not set.
   *
   * @throws Error if the aggregate has not been created
   * @returns The aggregate ID
   */
  private ensureInitialized(): string {
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
    this.ensureInitialized();
    // Status is guaranteed to be set if aggregate is initialized
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.status!;
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

  // Getters for accessing aggregate state
  // All getters ensure the aggregate is initialized before returning values
  getId(): string {
    return this.ensureInitialized();
  }

  getCompanyName(): string {
    this.ensureInitialized();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.companyName!;
  }

  getEmail(): Email {
    this.ensureInitialized();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.email!;
  }

  getPhone(): string | null {
    this.ensureInitialized();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.phone!;
  }

  getAddress(): string | null {
    this.ensureInitialized();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.address!;
  }

  getStatus(): ClientStatus {
    this.ensureInitialized();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.status!;
  }

  getNotes(): string | null {
    this.ensureInitialized();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.notes!;
  }
}
