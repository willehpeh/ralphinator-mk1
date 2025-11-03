/**
 * Value object encapsulating contact information.
 * Used to reduce parameter duplication across domain events, commands, and aggregates.
 */
export class ContactData {
  constructor(
    public readonly contactId: string,
    public readonly name: string,
    public readonly role: string | null,
    public readonly email: string | null,
    public readonly phone: string | null
  ) {}

  /**
   * Factory method to create ContactData from payload objects.
   * Reduces duplication in command handlers.
   *
   * @param payload - Object containing contact data properties
   * @returns New ContactData instance
   */
  static fromPayload(payload: {
    contactId: string;
    name: string;
    role: string | null;
    email: string | null;
    phone: string | null;
  }): ContactData {
    return new ContactData(
      payload.contactId,
      payload.name,
      payload.role,
      payload.email,
      payload.phone
    );
  }

  /**
   * Factory method to create ContactData from DTOs (AddContactDto or UpdateContactDto).
   * Normalizes optional fields (undefined or null) to explicit null values.
   * Reduces duplication in controllers and ensures consistent null handling.
   *
   * @param contactId - The unique identifier for the contact
   * @param dto - DTO containing contact data (from API request)
   * @returns New ContactData instance with normalized null values
   */
  static fromDto(
    contactId: string,
    dto: {
      name: string;
      role?: string | null;
      email?: string | null;
      phone?: string | null;
    }
  ): ContactData {
    return new ContactData(
      contactId,
      dto.name,
      dto.role ?? null,
      dto.email ?? null,
      dto.phone ?? null
    );
  }
}
