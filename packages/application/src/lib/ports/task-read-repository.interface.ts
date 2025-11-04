import { TaskReadModel } from '../read-models/task.read-model';

export interface ITaskReadRepository {
  findById(id: string): Promise<TaskReadModel | null>;
  findAll(): Promise<TaskReadModel[]>;
  save(task: TaskReadModel): Promise<void>;
  delete(id: string): Promise<void>;
}
