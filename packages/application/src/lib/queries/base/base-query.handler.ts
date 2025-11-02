import { Inject } from '@nestjs/common';
import { IClientReadRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Base class for query handlers that work with client read models.
 * Provides common constructor injection and access to the read repository.
 *
 * @template TQuery - The query type this handler processes
 * @template TResult - The return type of the query execution
 */
export abstract class BaseQueryHandler<TQuery, TResult> {
  constructor(
    @Inject(INJECTION_TOKENS.CLIENT_READ_REPOSITORY)
    protected readonly readRepository: IClientReadRepository
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
