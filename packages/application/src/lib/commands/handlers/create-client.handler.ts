import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateClientCommand } from '../create-client.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { IEventStore } from '../../ports/event-store.interface';

/**
 * Command handler for creating a new client.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(CreateClientCommand)
export class CreateClientHandler implements ICommandHandler<CreateClientCommand> {
  constructor(
    @Inject('IEventStore') private readonly eventStore: IEventStore,
    private readonly eventBus: EventBus
  ) {}

  /**
   * Executes the CreateClientCommand
   *
   * @param command - The create client command
   * @returns The ID of the newly created client
   */
  async execute(command: CreateClientCommand): Promise<string> {
    // Create new client aggregate using domain logic
    const client = ClientAggregate.create(
      command.id,
      command.companyName,
      command.email,
      command.phone,
      command.address,
      command.status,
      command.notes
    );

    // Persist domain events to event store
    // Expected version -1 indicates this is a new aggregate
    await this.eventStore.appendEvents(
      command.id,
      client.getUncommittedEvents(),
      -1
    );

    // Publish integration event for side effects
    // This allows other parts of the system to react to client creation
    this.eventBus.publish({
      clientId: command.id,
      companyName: command.companyName,
      email: command.email,
    });

    return command.id;
  }
}
