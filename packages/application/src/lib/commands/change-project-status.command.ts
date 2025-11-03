import { ProjectStatus } from '@angular-nest-starter/shared-types';

export class ChangeProjectStatusCommand {
  constructor(
    public readonly id: string,
    public readonly newStatus: ProjectStatus
  ) {}
}
