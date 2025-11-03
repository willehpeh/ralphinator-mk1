import { Inject } from '@nestjs/common';
import { BaseQueryHandler } from './base-query.handler';
import { IProjectReadRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Base class for query handlers that work with project read models.
 * Extends BaseQueryHandler with project-specific repository injection.
 *
 * @template TQuery - The query type this handler processes
 * @template TResult - The return type of the query execution
 */
export abstract class ProjectQueryHandler<TQuery, TResult>
  extends BaseQueryHandler<TQuery, TResult, IProjectReadRepository> {
  constructor(
    @Inject(INJECTION_TOKENS.PROJECT_READ_REPOSITORY)
    readRepository: IProjectReadRepository
  ) {
    super(readRepository);
  }
}
