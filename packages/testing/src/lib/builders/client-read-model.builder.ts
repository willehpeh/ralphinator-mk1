import { ClientReadModel } from '@angular-nest-starter/application';
import { BaseClientDataBuilder } from './base-client-data.builder';

/**
 * Test builder for ClientReadModel instances.
 * Reduces test boilerplate and makes test data intent clearer.
 *
 * @example
 * ```typescript
 * const readModel = new ClientReadModelBuilder()
 *   .withId('client-123')
 *   .withCompanyName('Acme Corporation')
 *   .withEmail('contact@acme.com')
 *   .build();
 * ```
 */
export class ClientReadModelBuilder extends BaseClientDataBuilder<ClientReadModel> {
  private createdAt = new Date('2025-11-01T00:00:00.000Z');

  withCreatedAt(createdAt: Date): this {
    this.createdAt = createdAt;
    return this;
  }

  /**
   * Builds a ClientReadModel instance with the configured properties.
   *
   * @returns ClientReadModel instance
   */
  build(): ClientReadModel {
    return new ClientReadModel(
      this.id,
      this.companyName,
      this.email,
      this.phone,
      this.address,
      this.status,
      this.notes,
      this.createdAt
    );
  }
}
