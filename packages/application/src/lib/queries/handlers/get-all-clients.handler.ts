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
   * @throws Error if the read repository operation fails
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_query: GetAllClientsQuery): Promise<ClientReadModel[]> {
    try {
      return await this.readRepository.findAll();
    } catch (error) {
      const message = 'Failed to retrieve all clients from read model';
      throw new Error(
        `${message}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
