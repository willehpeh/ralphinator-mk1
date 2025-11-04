import { TaskReadModel } from '../read-models/task.read-model';

export interface ITaskReadRepository {
  findById(id: string): Promise<TaskReadModel | null>;
  findAll(): Promise<TaskReadModel[]>;
  findByProjectId(projectId: string): Promise<TaskReadModel[]>;
  findByClientId(clientId: string): Promise<TaskReadModel[]>;
  save(task: TaskReadModel): Promise<void>;
  delete(id: string): Promise<void>;
}
