import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClientByIdQuery } from '../get-client-by-id.query';
import { ClientReadModel } from '../../read-models/client.read-model';
import { BaseQueryHandler } from '../base';

/**
 * Query handler for retrieving a client by ID.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetClientByIdQuery)
export class GetClientByIdQueryHandler
  extends BaseQueryHandler<GetClientByIdQuery, ClientReadModel | null>
  implements IQueryHandler<GetClientByIdQuery, ClientReadModel | null>
{
  /**
   * Executes the GetClientByIdQuery
   *
   * @param query - The get client by ID query
   * @returns The client read model or null if not found
   */
  async execute(query: GetClientByIdQuery): Promise<ClientReadModel | null> {
    return this.readRepository.findById(query.id);
  }
}
