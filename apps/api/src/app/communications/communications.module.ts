import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  GetAllCommunicationsQueryHandler,
  GetCommunicationsByClientIdQueryHandler,
  GetCommunicationsByContactIdQueryHandler,
  GetCommunicationsByProjectIdQueryHandler,
  GetCommunicationsRequiringFollowUpQueryHandler,
  INJECTION_TOKENS,
} from '@angular-nest-starter/application';
import {
  InMemoryCommunicationReadRepository,
} from '@angular-nest-starter/infrastructure';
import { CommunicationsController } from './communications.controller';

const CommandHandlers: never[] = [];
const QueryHandlers = [
  GetAllCommunicationsQueryHandler,
  GetCommunicationsByClientIdQueryHandler,
  GetCommunicationsByContactIdQueryHandler,
  GetCommunicationsByProjectIdQueryHandler,
  GetCommunicationsRequiringFollowUpQueryHandler,
];
const EventHandlers: never[] = [];

@Module({
  imports: [CqrsModule],
  controllers: [CommunicationsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    // Infrastructure implementations
    {
      provide: INJECTION_TOKENS.COMMUNICATION_READ_REPOSITORY,
      useClass: InMemoryCommunicationReadRepository,
    },
  ],
})
export class CommunicationsModule {}
