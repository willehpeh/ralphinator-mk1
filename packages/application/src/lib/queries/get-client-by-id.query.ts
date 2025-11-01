import { IQuery } from '@nestjs/cqrs';

export class GetClientByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
