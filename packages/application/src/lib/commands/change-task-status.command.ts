import { TaskStatus } from '@angular-nest-starter/shared-types';

export class ChangeTaskStatusCommand {
  constructor(
    public readonly taskId: string,
    public readonly newStatus: TaskStatus
  ) {}
}
