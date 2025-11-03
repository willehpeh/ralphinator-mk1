import { Injectable } from '@nestjs/common';
import { IContactReadRepository, ContactReadModel } from '@angular-nest-starter/application';

/**
 * In-memory implementation of IContactReadRepository
 *
 * This implementation stores contact read models in memory using a Map.
 * It is suitable for development and testing purposes only.
 *
 * **IMPORTANT**: Data is lost when the application restarts.
 * For production use, implement a persistent repository using PostgreSQL,
 * MongoDB, or another database.
 *
 * @implements {IContactReadRepository}
 */
@Injectable()
export class InMemoryContactReadRepository implements IContactReadRepository {
  private readonly contacts = new Map<string, ContactReadModel>();

  /**
   * Retrieves all contacts associated with a specific client.
   *
   * @param clientId - The ID of the client
   * @returns Array of contact read models for the client
   */
  async findByClientId(clientId: string): Promise<ContactReadModel[]> {
    return Array.from(this.contacts.values()).filter(
      (contact) => contact.clientId === clientId
    );
  }

  /**
   * Saves a contact read model to the repository.
   *
   * This method upserts the contact (insert or update).
   * If a contact with the same ID already exists, it will be replaced.
   *
   * @param contact - The contact read model to save
   */
  async save(contact: ContactReadModel): Promise<void> {
    this.contacts.set(contact.contactId, contact);
  }

  /**
   * Deletes a contact from the repository.
   *
   * @param contactId - The ID of the contact to delete
   */
  async delete(contactId: string): Promise<void> {
    this.contacts.delete(contactId);
  }

  /**
   * Utility method to clear all contacts (useful for testing)
   *
   * Note: This method is not part of the IContactReadRepository interface
   * and should only be used for testing purposes.
   */
  async clear(): Promise<void> {
    this.contacts.clear();
  }
}
