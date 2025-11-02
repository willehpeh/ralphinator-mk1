import { EventSourcedAggregate } from '../base/event-sourced-aggregate';
import { ClientStatus } from '../types/client-status.type';
import { CLIENT_EVENT_TYPES } from '../constants/client-event-types';
import { DOMAIN_ERRORS } from '../constants/domain-errors';
import { ClientCreatedDomainEvent } from '../events/client-created.domain-event';
import { ClientInformationUpdatedDomainEvent } from '../events/client-information-updated.domain-event';
import { ClientStatusChangedDomainEvent } from '../events/client-status-changed.domain-event';
import { ClientDeletedDomainEvent } from '../events/client-deleted.domain-event';
import { ClientData } from '../value-objects/client-data.value-object';

export class ClientAggregate extends EventSourcedAggregate {
  private id?: string;
  private companyName?: string;
  private email?: string;
  private phone?: string | null;
  private address?: string | null;
  private status?: ClientStatus;
  private notes?: string | null;

  constructor() {
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

    if (!this.status) {
      throw new Error(DOMAIN_ERRORS.CLIENT_STATUS_NOT_INITIALIZED);
    }

    if (this.status === newStatus) {
      throw new Error(DOMAIN_ERRORS.CLIENT_STATUS_UNCHANGED);
    }

    this.applyEvent(
      new ClientStatusChangedDomainEvent(
        id,
        this.status,
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
   * Event handler for ClientCreatedDomainEvent
   * Initializes the aggregate state when a new client is created
   */
  private onClientCreated(event: ClientCreatedDomainEvent): void {
    this.id = event.aggregateId;
    this.companyName = event.clientData.companyName;
    this.email = event.clientData.email;
    this.phone = event.clientData.phone;
    this.address = event.clientData.address;
    this.status = event.clientData.status;
    this.notes = event.clientData.notes;
  }

  /**
   * Event handler for ClientInformationUpdatedDomainEvent
   * Updates the aggregate state when client information changes
   */
  private onClientInformationUpdated(event: ClientInformationUpdatedDomainEvent): void {
    this.companyName = event.clientData.companyName;
    this.email = event.clientData.email;
    this.phone = event.clientData.phone;
    this.address = event.clientData.address;
    this.status = event.clientData.status;
    this.notes = event.clientData.notes;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onClientDeleted(_event: ClientDeletedDomainEvent): void {
    // Mark aggregate as deleted - state is preserved for event replay
    // The aggregate maintains its ID but is logically deleted
  }

  // Getters for accessing aggregate state
  getId(): string {
    return this.ensureInitialized();
  }

  getCompanyName(): string | undefined {
    return this.companyName;
  }

  getEmail(): string | undefined {
    return this.email;
  }

  getPhone(): string | null | undefined {
    return this.phone;
  }

  getAddress(): string | null | undefined {
    return this.address;
  }

  getStatus(): ClientStatus | undefined {
    return this.status;
  }

  getNotes(): string | null | undefined {
    return this.notes;
  }
}
