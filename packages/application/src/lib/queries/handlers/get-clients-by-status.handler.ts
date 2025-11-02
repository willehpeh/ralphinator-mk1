import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetClientsByStatusQuery } from '../get-clients-by-status.query';
import { ClientReadModel } from '../../read-models/client.read-model';
import {
  IClientReadRepository,
  INJECTION_TOKENS,
} from '../../ports';

@QueryHandler(GetClientsByStatusQuery)
export class GetClientsByStatusQueryHandler
  implements IQueryHandler<GetClientsByStatusQuery, ClientReadModel[]>
{
  constructor(
    @Inject(INJECTION_TOKENS.CLIENT_READ_REPOSITORY)
    private readonly readRepository: IClientReadRepository
  ) {}

  async execute(query: GetClientsByStatusQuery): Promise<ClientReadModel[]> {
    return this.readRepository.findByStatus(query.status);
  }
}
