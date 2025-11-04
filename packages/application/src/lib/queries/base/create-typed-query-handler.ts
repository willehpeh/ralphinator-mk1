import { Inject } from '@nestjs/common';
import { BaseQueryHandler } from './base-query.handler';

/**
 * Helper function to create a typed query handler base class with automatic repository injection.
 * This eliminates boilerplate code by generating the constructor with proper @Inject decorator.
 *
 * @template TRepository - The read repository interface type
 * @param injectionToken - The token to use for dependency injection
 * @returns An abstract class that extends BaseQueryHandler with repository injection
 *
 * @example
 * ```typescript
 * const ClientQueryHandlerBase = createTypedQueryHandler<IClientReadRepository>(
 *   INJECTION_TOKENS.CLIENT_READ_REPOSITORY
 * );
 *
 * export abstract class ClientQueryHandler<TQuery, TResult>
 *   extends ClientQueryHandlerBase<TQuery, TResult> {}
 * ```
 */
export function createTypedQueryHandler<TRepository>(injectionToken: string) {
  abstract class TypedQueryHandlerBase<TQuery, TResult> extends BaseQueryHandler<
    TQuery,
    TResult,
    TRepository
  > {
    constructor(@Inject(injectionToken) readRepository: TRepository) {
      super(readRepository);
    }
  }

  return TypedQueryHandlerBase;
}
