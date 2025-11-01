import { ClientReadModel } from '../read-models/client.read-model';

export interface IClientReadRepository {
  findById(id: string): Promise<ClientReadModel | null>;
}
