import { Injectable } from '@nestjs/common';
import { IProjectReadRepository, ProjectReadModel } from '@angular-nest-starter/application';
import { BaseInMemoryReadRepository } from './base-in-memory-read-repository';

/**
 * In-memory implementation of IProjectReadRepository
 *
 * This implementation stores project read models in memory using a Map.
 * It is suitable for development and testing purposes only.
 *
 * **IMPORTANT**: Data is lost when the application restarts.
 * For production use, implement a persistent repository using PostgreSQL,
 * MongoDB, or another database.
 *
 * @extends {BaseInMemoryReadRepository<ProjectReadModel>}
 * @implements {IProjectReadRepository}
 */
@Injectable()
export class InMemoryProjectReadRepository
  extends BaseInMemoryReadRepository<ProjectReadModel>
  implements IProjectReadRepository
{
  /**
   * Finds all projects for a specific client
   *
   * @param clientId - The client ID (UUID)
   * @returns Array of project read models belonging to the client
   */
  async findByClientId(clientId: string): Promise<ProjectReadModel[]> {
    return Array.from(this.items.values()).filter(
      (project) => project.clientId === clientId
    );
  }
}
