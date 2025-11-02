import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteClientCommand } from '../delete-client.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { IEventStore } from '../../ports/event-store.interface';

/**
 * Command handler for deleting a client.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(DeleteClientCommand)
export class DeleteClientHandler implements ICommandHandler<DeleteClientCommand> {
  constructor(
    @Inject('IEventStore') private readonly eventStore: IEventStore,
    private readonly eventBus: EventBus
  ) {}

  /**
   * Executes the DeleteClientCommand
   *
   * @param command - The delete client command
   * @returns The ID of the deleted client
   */
  async execute(command: DeleteClientCommand): Promise<string> {
    // Load existing client aggregate from event store
    const events = await this.eventStore.getEvents(command.id);
    const client = new ClientAggregate();
    events.forEach(event => client.apply(event));

    // Get current version before applying deletion
    const currentVersion = client.version;

    // Delete client using domain logic
    client.delete();

    // Get uncommitted events after deletion
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
