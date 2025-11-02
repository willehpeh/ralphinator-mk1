import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateClientHandler,
  UpdateClientHandler,
  ChangeClientStatusHandler,
  DeleteClientHandler,
  GetClientByIdQueryHandler,
  GetAllClientsQueryHandler,
  GetClientsByStatusQueryHandler,
} from '@angular-nest-starter/application';
import {
  ClientProjection,
  InMemoryEventStore,
  InMemoryClientReadRepository,
  AggregateRepository,
} from '@angular-nest-starter/infrastructure';
import { ClientsController } from './clients.controller';

const CommandHandlers = [CreateClientHandler, UpdateClientHandler, ChangeClientStatusHandler, DeleteClientHandler];
const QueryHandlers = [GetClientByIdQueryHandler, GetAllClientsQueryHandler, GetClientsByStatusQueryHandler];
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
    {
      provide: 'IAggregateRepository',
      useClass: AggregateRepository,
    },
  ],
})
export class ClientsModule {}
