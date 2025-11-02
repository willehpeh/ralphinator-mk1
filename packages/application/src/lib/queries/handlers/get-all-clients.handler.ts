import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllClientsQuery } from '../get-all-clients.query';
import { ClientReadModel } from '../../read-models/client.read-model';
import {
  IClientReadRepository,
  INJECTION_TOKENS,
} from '../../ports';

@QueryHandler(GetAllClientsQuery)
export class GetAllClientsQueryHandler
  implements IQueryHandler<GetAllClientsQuery, ClientReadModel[]>
{
  constructor(
    @Inject(INJECTION_TOKENS.CLIENT_READ_REPOSITORY)
    private readonly readRepository: IClientReadRepository
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_query: GetAllClientsQuery): Promise<ClientReadModel[]> {
    return this.readRepository.findAll();
  }
}
