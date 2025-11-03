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
}
