import { Injectable, Inject } from '@nestjs/common';
import { IContactReadRepository, ContactReadModel, IClientReadRepository } from '@angular-nest-starter/application';

/**
 * Default client name used when a client cannot be found
 */
const UNKNOWN_CLIENT_NAME = 'Unknown Client';

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

  constructor(
    @Inject('IClientReadRepository')
    private readonly clientRepository: IClientReadRepository
  ) {}

  /**
   * Enriches a contact with client name information.
   * Creates a new ContactReadModel instance with populated clientName.
   *
   * @param contact - The contact to enrich
   * @param clientName - The client's company name
   * @returns A new ContactReadModel with populated clientName
   */
  private enrichContactWithClientName(
    contact: ContactReadModel,
    clientName: string
  ): ContactReadModel {
    return new ContactReadModel(
      contact.contactId,
      contact.clientId,
      clientName,
      contact.name,
      contact.role,
      contact.email,
      contact.phone
    );
  }

  /**
   * Retrieves a specific contact by its ID.
   *
   * @param contactId - The ID of the contact
   * @returns The contact read model or null if not found
   */
  async findById(contactId: string): Promise<ContactReadModel | null> {
    const contact = this.contacts.get(contactId);
    if (!contact) {
      return null;
    }

    // Fetch client name from client repository
    const client = await this.clientRepository.findById(contact.clientId);
    const clientName = client?.companyName ?? UNKNOWN_CLIENT_NAME;

    // Return contact with populated clientName
    return this.enrichContactWithClientName(contact, clientName);
  }

  /**
   * Retrieves all contacts associated with a specific client.
   *
   * @param clientId - The ID of the client
   * @returns Array of contact read models for the client
   */
  async findByClientId(clientId: string): Promise<ContactReadModel[]> {
    const contacts = Array.from(this.contacts.values()).filter(
      (contact) => contact.clientId === clientId
    );

    // Fetch client name once for all contacts
    const client = await this.clientRepository.findById(clientId);
    const clientName = client?.companyName ?? UNKNOWN_CLIENT_NAME;

    // Return contacts with populated clientName
    return contacts.map(contact =>
      this.enrichContactWithClientName(contact, clientName)
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
   * Retrieves all contacts from all clients.
   *
   * @returns Array of all contact read models
   */
  async findAll(): Promise<ContactReadModel[]> {
    const contacts = Array.from(this.contacts.values());

    // Fetch all clients to map clientId to clientName
    const clients = await this.clientRepository.findAll();
    const clientMap = new Map(
      clients.map(client => [client.id, client.companyName])
    );

    // Return contacts with populated clientName
    return contacts.map(contact =>
      this.enrichContactWithClientName(
        contact,
        clientMap.get(contact.clientId) ?? UNKNOWN_CLIENT_NAME
      )
    );
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
