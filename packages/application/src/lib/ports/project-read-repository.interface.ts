import { ProjectReadModel } from '../read-models/project.read-model';

export interface IProjectReadRepository {
  findById(id: string): Promise<ProjectReadModel | null>;
  findByClientId(clientId: string): Promise<ProjectReadModel[]>;
  findAll(): Promise<ProjectReadModel[]>;
  save(project: ProjectReadModel): Promise<void>;
}
