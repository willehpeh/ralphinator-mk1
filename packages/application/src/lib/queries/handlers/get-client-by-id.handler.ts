import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClientByIdQuery } from '../get-client-by-id.query';
import { ClientReadModel } from '../../read-models/client.read-model';
import { IClientReadRepository } from '../../ports/client-read-repository.interface';
import { Inject } from '@nestjs/common';

@QueryHandler(GetClientByIdQuery)
export class GetClientByIdQueryHandler
  implements IQueryHandler<GetClientByIdQuery, ClientReadModel | null>
{
  constructor(
    @Inject('IClientReadRepository')
    private readonly readRepository: IClientReadRepository
  ) {}

  async execute(query: GetClientByIdQuery): Promise<ClientReadModel | null> {
    return this.readRepository.findById(query.id);
  }
}
