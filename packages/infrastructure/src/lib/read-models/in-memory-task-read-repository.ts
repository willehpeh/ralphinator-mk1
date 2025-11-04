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
  // Additional task-specific query methods can be added here in future iterations as needed
}
