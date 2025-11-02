import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateClientHandler,
  GetClientByIdQueryHandler,
  GetAllClientsQueryHandler,
} from '@angular-nest-starter/application';
import {
  ClientProjection,
  InMemoryEventStore,
  InMemoryClientReadRepository,
} from '@angular-nest-starter/infrastructure';
import { ClientsController } from './clients.controller';

const CommandHandlers = [CreateClientHandler];
const QueryHandlers = [GetClientByIdQueryHandler, GetAllClientsQueryHandler];
const EventHandlers = [ClientProjection];

@Module({
  imports: [CqrsModule],
  controllers: [ClientsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    // Infrastructure implementations
    {
      provide: 'IEventStore',
      useClass: InMemoryEventStore,
    },
    {
      provide: 'IClientReadRepository',
      useClass: InMemoryClientReadRepository,
    },
  ],
})
export class ClientsModule {}
