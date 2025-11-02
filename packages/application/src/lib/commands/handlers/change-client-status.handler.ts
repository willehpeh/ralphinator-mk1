import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ChangeClientStatusCommand } from '../change-client-status.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { IEventStore } from '../../ports/event-store.interface';

/**
 * Command handler for changing client status.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(ChangeClientStatusCommand)
export class ChangeClientStatusHandler implements ICommandHandler<ChangeClientStatusCommand> {
  constructor(
    @Inject('IEventStore') private readonly eventStore: IEventStore,
    private readonly eventBus: EventBus
  ) {}

  /**
   * Executes the ChangeClientStatusCommand
   *
   * @param command - The change client status command
   * @returns The ID of the client with updated status
   */
  async execute(command: ChangeClientStatusCommand): Promise<string> {
    // Load existing client aggregate from event store
    const events = await this.eventStore.getEvents(command.id);
    const client = new ClientAggregate();
    events.forEach(event => client.apply(event));

    // Get current version before applying new changes
    const currentVersion = client.version;

    // Change client status using domain logic
    client.changeStatus(command.newStatus);

    // Get uncommitted events after status change
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
