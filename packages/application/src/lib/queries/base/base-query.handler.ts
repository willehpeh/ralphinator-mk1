/**
 * Base class for query handlers that work with read models.
 * Provides common error handling through the executeQuery helper method.
 *
 * @template TQuery - The query type this handler processes
 * @template TResult - The return type of the query execution
 * @template TRepository - The read repository type this handler uses
 */
export abstract class BaseQueryHandler<TQuery, TResult, TRepository = unknown> {
  constructor(
    protected readonly readRepository: TRepository
  ) {}

  /**
   * Executes the query. Must be implemented by subclasses.
   *
   * @param query - The query to execute
   * @returns The result of the query execution
   */
  abstract execute(query: TQuery): Promise<TResult>;

  /**
   * Wraps a read repository operation with standardized error handling.
   * Use this helper to reduce duplication in query handler implementations.
   *
   * @param operation - The async operation to execute (typically a repository call)
   * @param errorContext - Descriptive context for the error message
   * @returns The result of the operation
   * @throws Error with formatted message if the operation fails
   *
   * @example
   * ```typescript
   * async execute(query: GetClientByIdQuery): Promise<ClientReadModel | null> {
   *   return this.executeQuery(
   *     () => this.readRepository.findById(query.id),
   *     `Failed to retrieve client with ID ${query.id} from read model`
   *   );
   * }
   * ```
   */
  protected async executeQuery<T>(
    operation: () => Promise<T>,
    errorContext: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw new Error(
        `${errorContext}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
