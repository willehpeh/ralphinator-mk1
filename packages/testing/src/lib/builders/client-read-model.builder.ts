import { ClientReadModel } from '@angular-nest-starter/application';
import { ClientStatus } from '@angular-nest-starter/domain';

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
export class ClientReadModelBuilder {
  private id = 'test-client-id';
  private companyName = 'Test Company';
  private email = 'test@example.com';
  private phone: string | null = null;
  private address: string | null = null;
  private status: ClientStatus = 'Active';
  private notes: string | null = null;
  private createdAt = new Date('2025-11-01T00:00:00.000Z');

  withId(id: string): ClientReadModelBuilder {
    this.id = id;
    return this;
  }

  withCompanyName(companyName: string): ClientReadModelBuilder {
    this.companyName = companyName;
    return this;
  }

  withEmail(email: string): ClientReadModelBuilder {
    this.email = email;
    return this;
  }

  withPhone(phone: string | null): ClientReadModelBuilder {
    this.phone = phone;
    return this;
  }

  withAddress(address: string | null): ClientReadModelBuilder {
    this.address = address;
    return this;
  }

  withStatus(status: ClientStatus): ClientReadModelBuilder {
    this.status = status;
    return this;
  }

  withNotes(notes: string | null): ClientReadModelBuilder {
    this.notes = notes;
    return this;
  }

  withCreatedAt(createdAt: Date): ClientReadModelBuilder {
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
