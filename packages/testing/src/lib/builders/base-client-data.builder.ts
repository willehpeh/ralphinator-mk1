import { ClientStatus } from '@angular-nest-starter/domain';

/**
 * Abstract base builder containing common client data properties and fluent methods.
 * Eliminates duplication between ClientAggregateBuilder and ClientReadModelBuilder.
 *
 * @template T The type of object being built (ClientAggregate or ClientReadModel)
 */
export abstract class BaseClientDataBuilder<T> {
  protected id = 'test-client-id';
  protected companyName = 'Test Company';
  protected email = 'test@example.com';
  protected phone: string | null = null;
  protected address: string | null = null;
  protected status: ClientStatus = 'Active';
  protected notes: string | null = null;

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withCompanyName(name: string): this {
    this.companyName = name;
    return this;
  }

  withEmail(email: string): this {
    this.email = email;
    return this;
  }

  withPhone(phone: string | null): this {
    this.phone = phone;
    return this;
  }

  withAddress(address: string | null): this {
    this.address = address;
    return this;
  }

  withStatus(status: ClientStatus): this {
    this.status = status;
    return this;
  }

  withNotes(notes: string | null): this {
    this.notes = notes;
    return this;
  }

  /**
   * Subclasses must implement the specific build logic for their type.
   *
   * @returns Instance of type T
   */
  abstract build(): T;
}
