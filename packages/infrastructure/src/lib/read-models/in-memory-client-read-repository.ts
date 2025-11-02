import { Injectable } from '@nestjs/common';
import { IClientReadRepository, ClientReadModel } from '@angular-nest-starter/application';
import { ClientStatus } from '@angular-nest-starter/domain';

/**
 * In-memory implementation of IClientReadRepository
 *
 * This implementation stores client read models in memory using a Map.
 * It is suitable for development and testing purposes only.
 *
 * **IMPORTANT**: Data is lost when the application restarts.
 * For production use, implement a persistent repository using PostgreSQL,
 * MongoDB, or another database.
 *
 * @implements {IClientReadRepository}
 */
@Injectable()
export class InMemoryClientReadRepository implements IClientReadRepository {
  private readonly clients = new Map<string, ClientReadModel>();

  /**
   * Finds a client by ID
   *
   * @param id - The client ID (UUID)
   * @returns The client read model or null if not found
   */
  async findById(id: string): Promise<ClientReadModel | null> {
    const client = this.clients.get(id);
    return client ?? null;
  }

  /**
   * Saves a client read model
   *
   * This method upserts the client (insert or update).
   * If a client with the same ID already exists, it will be replaced.
   *
   * @param client - The client read model to save
   */
  async save(client: ClientReadModel): Promise<void> {
    this.clients.set(client.id, client);
  }

  /**
   * Finds clients by status
   *
   * @param status - The client status to filter by
   * @returns Array of client read models matching the specified status
   */
  async findByStatus(status: ClientStatus): Promise<ClientReadModel[]> {
    return Array.from(this.clients.values()).filter(
      (client) => client.status === status
    );
  }

  /**
   * Finds all clients
   *
   * @returns Array of all client read models
   */
  async findAll(): Promise<ClientReadModel[]> {
    return Array.from(this.clients.values());
  }

  /**
   * Deletes a client by ID
   *
   * @param id - The client ID to delete
   */
  async delete(id: string): Promise<void> {
    this.clients.delete(id);
  }

  /**
   * Utility method to clear all clients (useful for testing)
   *
   * Note: This method is not part of the IClientReadRepository interface
   * and should only be used for testing purposes.
   */
  async clear(): Promise<void> {
    this.clients.clear();
  }
}
