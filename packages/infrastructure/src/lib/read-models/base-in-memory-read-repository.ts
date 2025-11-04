/**
 * Generic base class for in-memory read repositories.
 * Provides common CRUD operations for read models with a Map-based storage.
 *
 * @template T - The read model type, must have an 'id' property
 */
export abstract class BaseInMemoryReadRepository<T extends { id: string }> {
  protected readonly items = new Map<string, T>();

  /**
   * Find a read model by its ID
   */
  async findById(id: string): Promise<T | null> {
    return this.items.get(id) ?? null;
  }

  /**
   * Save (create or update) a read model
   */
  async save(item: T): Promise<void> {
    this.items.set(item.id, item);
  }

  /**
   * Get all read models
   */
  async findAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  /**
   * Delete a read model by its ID
   */
  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  /**
   * Clear all read models (useful for testing)
   */
  async clear(): Promise<void> {
    this.items.clear();
  }
}
