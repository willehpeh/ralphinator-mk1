import { ContactReadModel } from '../read-models/contact.read-model';

/**
 * Port interface for contact read model repository.
 * Defines operations for querying contact read models.
 * Implementation is provided in the infrastructure layer.
 */
export interface IContactReadRepository {
  /**
   * Retrieves a specific contact by its ID.
   *
   * @param contactId - The ID of the contact
   * @returns The contact read model or null if not found
   */
  findById(contactId: string): Promise<ContactReadModel | null>;

  /**
   * Retrieves all contacts associated with a specific client.
   *
   * @param clientId - The ID of the client
   * @returns Array of contact read models for the client
   */
  findByClientId(clientId: string): Promise<ContactReadModel[]>;

  /**
   * Saves a contact read model to the repository.
   *
   * @param contact - The contact read model to save
   */
  save(contact: ContactReadModel): Promise<void>;

  /**
   * Deletes a contact from the repository.
   *
   * @param contactId - The ID of the contact to delete
   */
  delete(contactId: string): Promise<void>;

  /**
   * Retrieves all contacts from all clients.
   *
   * @returns Array of all contact read models
   */
  findAll(): Promise<ContactReadModel[]>;
}
