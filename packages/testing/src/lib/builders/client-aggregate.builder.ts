import {
  ClientAggregate,
  ClientData,
  ClientCreatedDomainEvent,
  Email,
} from '@angular-nest-starter/domain';
import { BaseClientDataBuilder } from './base-client-data.builder';

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
export class ClientAggregateBuilder extends BaseClientDataBuilder<ClientAggregate> {
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
      Email.create(this.email),
      this.phone,
      this.address,
      this.status,
      this.notes
    );
    const event = new ClientCreatedDomainEvent(this.id, clientData);
    aggregate.apply(event);
    return aggregate;
  }
}
