import { Injectable } from '@nestjs/common';
import { IProjectReadRepository, ProjectReadModel } from '@angular-nest-starter/application';

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
 * @implements {IProjectReadRepository}
 */
@Injectable()
export class InMemoryProjectReadRepository implements IProjectReadRepository {
  private readonly projects = new Map<string, ProjectReadModel>();

  /**
   * Finds a project by ID
   *
   * @param id - The project ID (UUID)
   * @returns The project read model or null if not found
   */
  async findById(id: string): Promise<ProjectReadModel | null> {
    const project = this.projects.get(id);
    return project ?? null;
  }

  /**
   * Finds all projects for a specific client
   *
   * @param clientId - The client ID (UUID)
   * @returns Array of project read models belonging to the client
   */
  async findByClientId(clientId: string): Promise<ProjectReadModel[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.clientId === clientId
    );
  }

  /**
   * Finds all projects
   *
   * @returns Array of all project read models
   */
  async findAll(): Promise<ProjectReadModel[]> {
    return Array.from(this.projects.values());
  }

  /**
   * Saves a project read model
   *
   * This method upserts the project (insert or update).
   * If a project with the same ID already exists, it will be replaced.
   *
   * @param project - The project read model to save
   */
  async save(project: ProjectReadModel): Promise<void> {
    this.projects.set(project.id, project);
  }

  /**
   * Utility method to clear all projects (useful for testing)
   *
   * Note: This method is not part of the IProjectReadRepository interface
   * and should only be used for testing purposes.
   */
  async clear(): Promise<void> {
    this.projects.clear();
  }
}
