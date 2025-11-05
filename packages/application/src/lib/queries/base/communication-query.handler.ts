import { ICommunicationReadRepository, INJECTION_TOKENS } from '../../ports';
import { createTypedQueryHandler } from './create-typed-query-handler';

// Create the base class with injected repository
const CommunicationQueryHandlerBase = createTypedQueryHandler<ICommunicationReadRepository>(
  INJECTION_TOKENS.COMMUNICATION_READ_REPOSITORY
);

/**
 * Base class for query handlers that work with communication read models.
 * Extends BaseQueryHandler with communication-specific repository injection.
 *
 * @template TQuery - The query type this handler processes
 * @template TResult - The return type of the query execution
 */
export abstract class CommunicationQueryHandler<
  TQuery,
  TResult
> extends CommunicationQueryHandlerBase<TQuery, TResult> {}
