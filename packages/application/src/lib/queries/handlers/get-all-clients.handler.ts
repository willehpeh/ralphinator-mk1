import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllClientsQuery } from '../get-all-clients.query';
import { ClientReadModel } from '../../read-models/client.read-model';
import { BaseQueryHandler } from '../base';

/**
 * Query handler for retrieving all clients.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetAllClientsQuery)
export class GetAllClientsQueryHandler
  extends BaseQueryHandler<GetAllClientsQuery, ClientReadModel[]>
  implements IQueryHandler<GetAllClientsQuery, ClientReadModel[]>
{
  /**
   * Executes the GetAllClientsQuery
   *
   * @param _query - The get all clients query (unused)
   * @returns Array of all client read models
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_query: GetAllClientsQuery): Promise<ClientReadModel[]> {
    return this.readRepository.findAll();
  }
}
