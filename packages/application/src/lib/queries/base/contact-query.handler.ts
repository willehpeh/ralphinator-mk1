import { Inject } from '@nestjs/common';
import { BaseQueryHandler } from './base-query.handler';
import { IContactReadRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Base class for query handlers that work with contact read models.
 * Extends BaseQueryHandler with contact-specific repository injection.
 *
 * @template TQuery - The query type this handler processes
 * @template TResult - The return type of the query execution
 */
export abstract class ContactQueryHandler<TQuery, TResult>
  extends BaseQueryHandler<TQuery, TResult, IContactReadRepository> {
  constructor(
    @Inject(INJECTION_TOKENS.CONTACT_READ_REPOSITORY)
    readRepository: IContactReadRepository
  ) {
    super(readRepository);
  }
}
