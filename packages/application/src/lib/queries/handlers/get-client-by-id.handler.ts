import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetClientByIdQuery } from '../get-client-by-id.query';
import { ClientReadModel } from '../../read-models/client.read-model';
import {
  IClientReadRepository,
  INJECTION_TOKENS,
} from '../../ports';

@QueryHandler(GetClientByIdQuery)
export class GetClientByIdQueryHandler
  implements IQueryHandler<GetClientByIdQuery, ClientReadModel | null>
{
  constructor(
    @Inject(INJECTION_TOKENS.CLIENT_READ_REPOSITORY)
    private readonly readRepository: IClientReadRepository
  ) {}

  async execute(query: GetClientByIdQuery): Promise<ClientReadModel | null> {
    return this.readRepository.findById(query.id);
  }
}
