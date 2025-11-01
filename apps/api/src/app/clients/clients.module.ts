import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateClientHandler,
  GetClientByIdQueryHandler,
} from '@angular-nest-starter/application';
import { ClientProjection } from '@angular-nest-starter/infrastructure';

const CommandHandlers = [CreateClientHandler];
const QueryHandlers = [GetClientByIdQueryHandler];
const EventHandlers = [ClientProjection];

@Module({
  imports: [CqrsModule],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class ClientsModule {}
