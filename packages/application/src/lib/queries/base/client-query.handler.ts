import { IClientReadRepository, INJECTION_TOKENS } from '../../ports';
import { createTypedQueryHandler } from './create-typed-query-handler';

// Create the base class with injected repository
const ClientQueryHandlerBase = createTypedQueryHandler<IClientReadRepository>(
  INJECTION_TOKENS.CLIENT_READ_REPOSITORY
);

/**
 * Base class for query handlers that work with client read models.
 * Extends BaseQueryHandler with client-specific repository injection.
 *
 * @template TQuery - The query type this handler processes
 * @template TResult - The return type of the query execution
 */
export abstract class ClientQueryHandler<
  TQuery,
  TResult
> extends ClientQueryHandlerBase<TQuery, TResult> {}
