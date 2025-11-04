import { Injectable } from '@nestjs/common';
import { IClientReadRepository, ClientReadModel } from '@angular-nest-starter/application';
import { ClientStatus } from '@angular-nest-starter/shared-types';
import { BaseInMemoryReadRepository } from './base-in-memory-read-repository';

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
 * @extends {BaseInMemoryReadRepository<ClientReadModel>}
 * @implements {IClientReadRepository}
 */
@Injectable()
export class InMemoryClientReadRepository
  extends BaseInMemoryReadRepository<ClientReadModel>
  implements IClientReadRepository
{
  /**
   * Finds clients by status
   *
   * @param status - The client status to filter by
   * @returns Array of client read models matching the specified status
   */
  async findByStatus(status: ClientStatus): Promise<ClientReadModel[]> {
    return Array.from(this.items.values()).filter(
      (client) => client.status === status
    );
  }
}
