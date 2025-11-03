/**
 * Read model for contact queries
 * Optimized DTO for read operations
 */
export class ContactReadModel {
  constructor(
    public readonly contactId: string,
    public readonly clientId: string,
    public readonly clientName: string,
    public readonly name: string,
    public readonly role: string | null,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
