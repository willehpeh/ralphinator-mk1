import { ClientReadModel } from '../read-models/client.read-model';
import { ClientStatus } from '@angular-nest-starter/domain';

export interface IClientReadRepository {
  findById(id: string): Promise<ClientReadModel | null>;
  findAll(): Promise<ClientReadModel[]>;
  findByStatus(status: ClientStatus): Promise<ClientReadModel[]>;
  save(client: ClientReadModel): Promise<void>;
}
