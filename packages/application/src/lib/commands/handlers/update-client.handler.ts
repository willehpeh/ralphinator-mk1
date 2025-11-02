import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateClientCommand } from '../update-client.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { IEventStore } from '../../ports/event-store.interface';

/**
 * Command handler for updating client information.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(UpdateClientCommand)
export class UpdateClientHandler implements ICommandHandler<UpdateClientCommand> {
  constructor(
    @Inject('IEventStore') private readonly eventStore: IEventStore,
    private readonly eventBus: EventBus
  ) {}

  /**
   * Executes the UpdateClientCommand
   *
   * @param command - The update client command
   * @returns The ID of the updated client
   */
  async execute(command: UpdateClientCommand): Promise<string> {
    // Load existing client aggregate from event store
    const events = await this.eventStore.getEvents(command.id);
    const client = new ClientAggregate();
    events.forEach(event => client.apply(event));

    // Get current version before applying new changes
    const currentVersion = client.version;

    // Update client information using domain logic
    client.updateInformation(
      command.companyName,
      command.email,
      command.phone,
      command.address,
      command.status,
      command.notes
    );

    // Get uncommitted events after update
    const uncommittedEvents = client.getUncommittedEvents();

    // Persist domain events to event store with optimistic concurrency control
    await this.eventStore.appendEvents(
      command.id,
      uncommittedEvents,
      currentVersion
    );

    // Publish domain events to EventBus
    // This triggers projections to update read models
    uncommittedEvents.forEach(event => this.eventBus.publish(event));

    return command.id;
  }
}
