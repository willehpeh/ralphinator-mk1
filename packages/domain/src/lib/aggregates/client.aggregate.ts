import { EventSourcedAggregate } from '../base/event-sourced-aggregate';
import { ClientStatus } from '../types/client-status.type';
import { CLIENT_EVENT_TYPES } from '../constants/client-event-types';
import { ClientCreatedDomainEvent } from '../events/client-created.domain-event';
import { ClientInformationUpdatedDomainEvent } from '../events/client-information-updated.domain-event';
import { ClientStatusChangedDomainEvent } from '../events/client-status-changed.domain-event';
import { ClientDeletedDomainEvent } from '../events/client-deleted.domain-event';

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
    // Register event handlers for all client events
    this.registerEventHandler(CLIENT_EVENT_TYPES.CREATED, this.onClientCreated.bind(this));
    this.registerEventHandler(CLIENT_EVENT_TYPES.INFORMATION_UPDATED, this.onClientInformationUpdated.bind(this));
    this.registerEventHandler(CLIENT_EVENT_TYPES.STATUS_CHANGED, this.onClientStatusChanged.bind(this));
    this.registerEventHandler(CLIENT_EVENT_TYPES.DELETED, this.onClientDeleted.bind(this));
  }

  /**
   * Factory method to create a new Client aggregate
   *
   * @param id - Unique identifier for the client
   * @param companyName - Name of the client company
   * @param email - Client contact email
   * @param phone - Client contact phone number
   * @param address - Client physical address
   * @param status - Client relationship status
   * @param notes - Additional notes about the client
   * @returns A new ClientAggregate instance with ClientCreatedDomainEvent applied
   */
  static create(
    id: string,
    companyName: string,
    email: string,
    phone: string | null,
    address: string | null,
    status: ClientStatus,
    notes: string | null
  ): ClientAggregate {
    const client = new ClientAggregate();
    client.applyEvent(
      new ClientCreatedDomainEvent(
        id,
        companyName,
        email,
        phone,
        address,
        status,
        notes
      )
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
      throw new Error('Cannot perform operation on a client that has not been created');
    }
    return this.id;
  }

  /**
   * Update client information
   *
   * @param companyName - Updated company name
   * @param email - Updated email
   * @param phone - Updated phone number
   * @param address - Updated address
   * @param status - Updated status
   * @param notes - Updated notes
   */
  updateInformation(
    companyName: string,
    email: string,
    phone: string | null,
    address: string | null,
    status: ClientStatus,
    notes: string | null
  ): void {
    const id = this.ensureInitialized();

    this.applyEvent(
      new ClientInformationUpdatedDomainEvent(
        id,
        companyName,
        email,
        phone,
        address,
        status,
        notes
      )
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
      throw new Error('Client status is not initialized');
    }

    if (this.status === newStatus) {
      throw new Error('New status must be different from current status');
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
    this.companyName = event.companyName;
    this.email = event.email;
    this.phone = event.phone;
    this.address = event.address;
    this.status = event.status;
    this.notes = event.notes;
  }

  /**
   * Event handler for ClientInformationUpdatedDomainEvent
   * Updates the aggregate state when client information changes
   */
  private onClientInformationUpdated(event: ClientInformationUpdatedDomainEvent): void {
    this.companyName = event.companyName;
    this.email = event.email;
    this.phone = event.phone;
    this.address = event.address;
    this.status = event.status;
    this.notes = event.notes;
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
