import {
  ClientAggregate,
  ClientData,
  ClientCreatedDomainEvent,
  ClientStatus,
} from '@angular-nest-starter/domain';

/**
 * Test builder for ClientAggregate instances.
 * Reduces test boilerplate and makes test data intent clearer.
 *
 * @example
 * ```typescript
 * const aggregate = new ClientAggregateBuilder()
 *   .withId('client-123')
 *   .withCompanyName('Acme Corporation')
 *   .withEmail('contact@acme.com')
 *   .build();
 * ```
 */
export class ClientAggregateBuilder {
  private clientId = 'test-client-id';
  private companyName = 'Test Company';
  private email = 'test@example.com';
  private phone: string | null = null;
  private address: string | null = null;
  private status: ClientStatus = 'Active';
  private notes: string | null = null;

  withId(id: string): ClientAggregateBuilder {
    this.clientId = id;
    return this;
  }

  withCompanyName(name: string): ClientAggregateBuilder {
    this.companyName = name;
    return this;
  }

  withEmail(email: string): ClientAggregateBuilder {
    this.email = email;
    return this;
  }

  withPhone(phone: string | null): ClientAggregateBuilder {
    this.phone = phone;
    return this;
  }

  withAddress(address: string | null): ClientAggregateBuilder {
    this.address = address;
    return this;
  }

  withStatus(status: ClientStatus): ClientAggregateBuilder {
    this.status = status;
    return this;
  }

  withNotes(notes: string | null): ClientAggregateBuilder {
    this.notes = notes;
    return this;
  }

  /**
   * Builds a ClientAggregate with initialized state.
   * The aggregate will have a ClientCreatedDomainEvent applied.
   *
   * @returns Fully initialized ClientAggregate
   */
  build(): ClientAggregate {
    const aggregate = new ClientAggregate();
    const clientData = new ClientData(
      this.companyName,
      this.email,
      this.phone,
      this.address,
      this.status,
      this.notes
    );
    const event = new ClientCreatedDomainEvent(this.clientId, clientData);
    aggregate.apply(event);
    return aggregate;
  }
}
