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
  INJECTION_TOKENS,
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
      provide: INJECTION_TOKENS.EVENT_STORE,
      useClass: InMemoryEventStore,
    },
    {
      provide: INJECTION_TOKENS.CLIENT_READ_REPOSITORY,
      useClass: InMemoryClientReadRepository,
    },
    {
      provide: INJECTION_TOKENS.AGGREGATE_REPOSITORY,
      useClass: AggregateRepository,
    },
  ],
})
export class ClientsModule {}
