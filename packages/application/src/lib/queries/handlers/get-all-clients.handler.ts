import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllClientsQuery } from '../get-all-clients.query';
import { ClientReadModel } from '../../read-models/client.read-model';
import { IClientReadRepository } from '../../ports/client-read-repository.interface';
import { Inject } from '@nestjs/common';

@QueryHandler(GetAllClientsQuery)
export class GetAllClientsQueryHandler
  implements IQueryHandler<GetAllClientsQuery, ClientReadModel[]>
{
  constructor(
    @Inject('IClientReadRepository')
    private readonly readRepository: IClientReadRepository
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_query: GetAllClientsQuery): Promise<ClientReadModel[]> {
    return this.readRepository.findAll();
  }
}
