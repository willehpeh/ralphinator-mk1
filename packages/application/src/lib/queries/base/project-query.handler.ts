import { IProjectReadRepository, INJECTION_TOKENS } from '../../ports';
import { createTypedQueryHandler } from './create-typed-query-handler';

// Create the base class with injected repository
const ProjectQueryHandlerBase = createTypedQueryHandler<IProjectReadRepository>(
  INJECTION_TOKENS.PROJECT_READ_REPOSITORY
);

/**
 * Base class for query handlers that work with project read models.
 * Extends BaseQueryHandler with project-specific repository injection.
 *
 * @template TQuery - The query type this handler processes
 * @template TResult - The return type of the query execution
 */
export abstract class ProjectQueryHandler<
  TQuery,
  TResult
> extends ProjectQueryHandlerBase<TQuery, TResult> {}
