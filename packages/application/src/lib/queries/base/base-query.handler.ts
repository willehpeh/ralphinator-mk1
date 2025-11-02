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
}
