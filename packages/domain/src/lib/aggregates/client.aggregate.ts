import { EventSourcedAggregate } from '../base/event-sourced-aggregate';
import { DomainEvent } from '../base/domain-event';
import { ClientCreatedDomainEvent } from '../events/client-created.domain-event';

export class ClientAggregate extends EventSourcedAggregate {
  private companyName?: string;
  private email?: string;
  private phone?: string;
  private address?: string;
  private status?: 'Active' | 'Inactive' | 'Prospect' | 'Past Client';
  private notes?: string;

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
    phone: string,
    address: string,
    status: 'Active' | 'Inactive' | 'Prospect' | 'Past Client',
    notes?: string
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
  getCompanyName(): string | undefined {
    return this.companyName;
  }

  getEmail(): string | undefined {
    return this.email;
  }

  getPhone(): string | undefined {
    return this.phone;
  }

  getAddress(): string | undefined {
    return this.address;
  }

  getStatus(): 'Active' | 'Inactive' | 'Prospect' | 'Past Client' | undefined {
    return this.status;
  }

  getNotes(): string | undefined {
    return this.notes;
  }
}
