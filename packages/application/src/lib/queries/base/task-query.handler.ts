import { ITaskReadRepository, INJECTION_TOKENS } from '../../ports';
import { createTypedQueryHandler } from './create-typed-query-handler';

// Create the base class with injected repository
const TaskQueryHandlerBase = createTypedQueryHandler<ITaskReadRepository>(
  INJECTION_TOKENS.TASK_READ_REPOSITORY
);

/**
 * Base class for query handlers that work with task read models.
 * Extends BaseQueryHandler with task-specific repository injection.
 *
 * @template TQuery - The query type this handler processes
 * @template TResult - The return type of the query execution
 */
export abstract class TaskQueryHandler<
  TQuery,
  TResult
> extends TaskQueryHandlerBase<TQuery, TResult> {}
