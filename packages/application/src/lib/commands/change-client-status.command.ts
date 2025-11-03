import { ClientStatus } from '@angular-nest-starter/shared-types';

export class ChangeClientStatusCommand {
  constructor(
    public readonly id: string,
    public readonly newStatus: ClientStatus
  ) {}
}
