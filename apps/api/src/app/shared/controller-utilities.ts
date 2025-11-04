import { NotFoundException } from '@nestjs/common';
import { QueryBus, IQuery } from '@nestjs/cqrs';

/**
 * Generic utility to fetch an entity after a mutation command and throw
 * NotFoundException if not found. This eliminates duplication across controllers
 * that follow the pattern: execute command → query for result → validate existence.
 *
 * @param queryBus - The CQRS query bus instance
 * @param queryConstructor - The query class constructor
 * @param queryArgs - Arguments to pass to the query constructor
 * @param entityName - Name of the entity for error messages (e.g., 'Client', 'Project')
 * @param entityId - The ID of the entity being fetched
 * @param operation - Description of the operation for context (e.g., 'update', 'status change')
 * @returns The fetched entity
 * @throws NotFoundException if the entity is not found after the mutation
 *
 * @example
 * ```typescript
 * const client = await fetchEntityAfterMutation(
 *   this.queryBus,
 *   GetClientByIdQuery,
 *   [clientId],
 *   'Client',
 *   clientId,
 *   'update'
 * );
 * ```
 */
export async function fetchEntityAfterMutation<TQuery extends IQuery, TResult>(
  queryBus: QueryBus,
  queryConstructor: new (...args: any[]) => TQuery,
  queryArgs: any[],
  entityName: string,
  entityId: string,
  operation: string
): Promise<TResult> {
  const query = new queryConstructor(...queryArgs);
  const result = await queryBus.execute<TQuery, TResult | null>(query);

  if (!result) {
    throw new NotFoundException(
      `${entityName} with ID ${entityId} not found after ${operation}`
    );
  }

  return result;
}

/**
 * Generic utility to fetch and validate that an entity exists before performing
 * a mutation operation. This is useful for operations that need to verify entity
 * existence upfront (e.g., to get related data like clientId).
 *
 * @param queryBus - The CQRS query bus instance
 * @param queryConstructor - The query class constructor
 * @param queryArgs - Arguments to pass to the query constructor
 * @param entityName - Name of the entity for error messages (e.g., 'Contact')
 * @returns The fetched entity
 * @throws NotFoundException if the entity is not found
 *
 * @example
 * ```typescript
 * const contact = await fetchAndValidateEntity(
 *   this.queryBus,
 *   GetContactByIdQuery,
 *   [contactId],
 *   'Contact'
 * );
 * ```
 */
export async function fetchAndValidateEntity<TQuery extends IQuery, TResult>(
  queryBus: QueryBus,
  queryConstructor: new (...args: any[]) => TQuery,
  queryArgs: any[],
  entityName: string
): Promise<TResult> {
  const query = new queryConstructor(...queryArgs);
  const result = await queryBus.execute<TQuery, TResult | null>(query);

  if (!result) {
    throw new NotFoundException(`${entityName} not found`);
  }

  return result;
}
