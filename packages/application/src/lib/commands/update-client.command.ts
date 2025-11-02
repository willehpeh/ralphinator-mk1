import { ClientStatus } from '@angular-nest-starter/domain';

export class UpdateClientCommand {
  constructor(
    public readonly id: string,
    public readonly companyName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly address: string,
    public readonly status: ClientStatus,
    public readonly notes?: string
  ) {}
}
