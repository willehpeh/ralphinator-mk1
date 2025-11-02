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
   * @throws Error if the read repository operation fails
   */
  async execute(query: GetClientByIdQuery): Promise<ClientReadModel | null> {
    try {
      return await this.readRepository.findById(query.id);
    } catch (error) {
      const message = `Failed to retrieve client with ID ${query.id} from read model`;
      throw new Error(
        `${message}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
