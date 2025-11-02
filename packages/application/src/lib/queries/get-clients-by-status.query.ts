import { IQuery } from '@nestjs/cqrs';
import { ClientStatus } from '@angular-nest-starter/domain';

export class GetClientsByStatusQuery implements IQuery {
  constructor(public readonly status: ClientStatus) {}
}
