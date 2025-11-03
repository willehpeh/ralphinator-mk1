import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  GetContactByIdQueryHandler,
  GetAllContactsQueryHandler,
  AddContactToClientHandler,
  UpdateContactCommandHandler,
  RemoveContactCommandHandler,
  GetClientContactsQueryHandler,
  INJECTION_TOKENS,
} from '@angular-nest-starter/application';
import {
  ContactProjection,
  InMemoryEventStore,
  InMemoryContactReadRepository,
  AggregateRepository,
} from '@angular-nest-starter/infrastructure';
import { ContactsController } from './contacts.controller';

const CommandHandlers = [AddContactToClientHandler, UpdateContactCommandHandler, RemoveContactCommandHandler];
const QueryHandlers = [GetContactByIdQueryHandler, GetAllContactsQueryHandler, GetClientContactsQueryHandler];
const EventHandlers = [ContactProjection];

@Module({
  imports: [CqrsModule],
  controllers: [ContactsController],
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
      provide: INJECTION_TOKENS.CONTACT_READ_REPOSITORY,
      useClass: InMemoryContactReadRepository,
    },
    {
      provide: INJECTION_TOKENS.AGGREGATE_REPOSITORY,
      useClass: AggregateRepository,
    },
  ],
})
export class ContactsModule {}
