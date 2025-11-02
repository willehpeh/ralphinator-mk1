import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClientsByStatusQuery } from '../get-clients-by-status.query';
import { ClientReadModel } from '../../read-models/client.read-model';
import { BaseQueryHandler } from '../base';

/**
 * Query handler for retrieving clients by status.
 * Follows CQRS pattern by querying read models.
 */
@QueryHandler(GetClientsByStatusQuery)
export class GetClientsByStatusQueryHandler
  extends BaseQueryHandler<GetClientsByStatusQuery, ClientReadModel[]>
  implements IQueryHandler<GetClientsByStatusQuery, ClientReadModel[]>
{
  /**
   * Executes the GetClientsByStatusQuery
   *
   * @param query - The get clients by status query
   * @returns Array of client read models matching the specified status
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetClientsByStatusQuery): Promise<ClientReadModel[]> {
    try {
      return await this.readRepository.findByStatus(query.status);
    } catch (error) {
      const message = `Failed to retrieve clients with status '${query.status}' from read model`;
      throw new Error(
        `${message}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
