import { IQuery } from '@nestjs/cqrs';
import { ClientStatus } from '@angular-nest-starter/shared-types';

export class GetClientsByStatusQuery implements IQuery {
  constructor(public readonly status: ClientStatus) {}
}
