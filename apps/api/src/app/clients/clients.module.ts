import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateClientHandler,
  GetClientByIdQueryHandler,
} from '@angular-nest-starter/application';
import { ClientProjection } from '@angular-nest-starter/infrastructure';
import { ClientsController } from './clients.controller';

const CommandHandlers = [CreateClientHandler];
const QueryHandlers = [GetClientByIdQueryHandler];
const EventHandlers = [ClientProjection];

@Module({
  imports: [CqrsModule],
  controllers: [ClientsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class ClientsModule {}
