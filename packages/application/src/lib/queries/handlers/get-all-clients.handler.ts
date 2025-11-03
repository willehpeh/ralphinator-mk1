import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllClientsQuery } from '../get-all-clients.query';
import { ClientReadModel } from '../../read-models/client.read-model';
import { ClientQueryHandler } from '../base';

/**
 * Query handler for retrieving all clients.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetAllClientsQuery)
export class GetAllClientsQueryHandler
  extends ClientQueryHandler<GetAllClientsQuery, ClientReadModel[]>
  implements IQueryHandler<GetAllClientsQuery, ClientReadModel[]>
{
  /**
   * Executes the GetAllClientsQuery
   *
   * @param _query - The get all clients query (unused)
   * @returns Array of all client read models
   * @throws Error if the read repository operation fails
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_query: GetAllClientsQuery): Promise<ClientReadModel[]> {
    return this.executeQuery(
      () => this.readRepository.findAll(),
      'Failed to retrieve all clients from read model'
    );
  }
}
