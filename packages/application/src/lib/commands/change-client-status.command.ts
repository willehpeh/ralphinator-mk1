import { ClientStatus } from '@angular-nest-starter/domain';

export class ChangeClientStatusCommand {
  constructor(
    public readonly id: string,
    public readonly newStatus: ClientStatus
  ) {}
}
