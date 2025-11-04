import { TaskDataPayload } from './task-data.payload';

export class CreateTaskCommand {
  constructor(
    public readonly id: string,
    public readonly data: TaskDataPayload
  ) {}
}
