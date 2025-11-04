import { TaskDataPayload } from './task-data.payload';

export class UpdateTaskDetailsCommand {
  constructor(
    public readonly id: string,
    public readonly data: TaskDataPayload
  ) {}
}
