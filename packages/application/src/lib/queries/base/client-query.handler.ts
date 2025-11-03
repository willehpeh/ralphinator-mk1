import { Inject } from '@nestjs/common';
import { BaseQueryHandler } from './base-query.handler';
import { IClientReadRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Base class for query handlers that work with client read models.
 * Extends BaseQueryHandler with client-specific repository injection.
 *
 * @template TQuery - The query type this handler processes
 * @template TResult - The return type of the query execution
 */
export abstract class ClientQueryHandler<TQuery, TResult>
  extends BaseQueryHandler<TQuery, TResult, IClientReadRepository> {
  constructor(
    @Inject(INJECTION_TOKENS.CLIENT_READ_REPOSITORY)
    readRepository: IClientReadRepository
  ) {
    super(readRepository);
  }
}
