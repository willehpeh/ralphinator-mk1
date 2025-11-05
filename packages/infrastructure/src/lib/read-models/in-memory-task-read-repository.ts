import { Injectable } from '@nestjs/common';
import { ITaskReadRepository, TaskReadModel } from '@angular-nest-starter/application';
import { BaseInMemoryReadRepository } from './base-in-memory-read-repository';

/**
 * In-memory implementation of ITaskReadRepository
 *
 * This implementation stores task read models in memory using a Map.
 * It is suitable for development and testing purposes only.
 *
 * **IMPORTANT**: Data is lost when the application restarts.
 * For production use, implement a persistent repository using PostgreSQL,
 * MongoDB, or another database.
 *
 * @extends {BaseInMemoryReadRepository<TaskReadModel>}
 * @implements {ITaskReadRepository}
 */
@Injectable()
export class InMemoryTaskReadRepository
  extends BaseInMemoryReadRepository<TaskReadModel>
  implements ITaskReadRepository
{
  // All CRUD methods (findById, findAll, save, delete) are inherited from BaseInMemoryReadRepository

  /**
   * Find all tasks associated with a specific project
   *
   * @param projectId - The unique identifier of the project
   * @returns Promise resolving to array of tasks for the project
   */
  async findByProjectId(projectId: string): Promise<TaskReadModel[]> {
    return Array.from(this.items.values()).filter(
      (task) => task.projectId === projectId
    );
  }

  /**
   * Find all tasks associated with a specific client
   *
   * @param clientId - The unique identifier of the client
   * @returns Promise resolving to array of tasks for the client
   */
  async findByClientId(clientId: string): Promise<TaskReadModel[]> {
    return Array.from(this.items.values()).filter(
      (task) => task.clientId === clientId
    );
  }

  /**
   * Find upcoming tasks sorted by due date (earliest first).
   * Returns only incomplete tasks (excludes 'Completed' and 'Cancelled').
   *
   * @param limit - Maximum number of tasks to return
   * @returns Promise resolving to array of upcoming tasks
   */
  async findUpcoming(limit: number): Promise<TaskReadModel[]> {
    return Array.from(this.items.values())
      .filter(
        (task) =>
          task.status !== 'Completed' &&
          task.status !== 'Cancelled' &&
          task.deadline !== null
      )
      .sort((a, b) => {
        // Sort by deadline (earliest first)
        const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return dateA - dateB;
      })
      .slice(0, limit);
  }
}
