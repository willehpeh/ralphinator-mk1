import { EventSourcedAggregate } from '../base/event-sourced-aggregate';
import { DomainEvent } from '../base/domain-event';
import { ClientCreatedDomainEvent, ClientStatus } from '../events/client-created.domain-event';

export class ClientAggregate extends EventSourcedAggregate {
  private id?: string;
  private companyName?: string;
  private email?: string;
  private phone?: string | null;
  private address?: string | null;
  private status?: ClientStatus;
  private notes?: string | null;

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
   * Apply domain events to rebuild aggregate state
   * This method is called when replaying events from the event store
   *
   * @param event - The domain event to apply
   */
  protected apply(event: DomainEvent): void {
    if (event instanceof ClientCreatedDomainEvent) {
      this.id = event.aggregateId;
      this.companyName = event.companyName;
      this.email = event.email;
      this.phone = event.phone;
      this.address = event.address;
      this.status = event.status;
      this.notes = event.notes;
    }
  }

  // Getters for accessing aggregate state
  getId(): string | undefined {
    return this.id;
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
