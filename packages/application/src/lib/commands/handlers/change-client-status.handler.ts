import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ChangeClientStatusCommand } from '../change-client-status.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import {
  IAggregateRepository,
  INJECTION_TOKENS,
} from '../../ports';

/**
 * Command handler for changing client status.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(ChangeClientStatusCommand)
export class ChangeClientStatusHandler implements ICommandHandler<ChangeClientStatusCommand> {
  constructor(
    @Inject(INJECTION_TOKENS.AGGREGATE_REPOSITORY)
    private readonly aggregateRepository: IAggregateRepository<ClientAggregate>
  ) {}

  /**
   * Executes the ChangeClientStatusCommand
   *
   * @param command - The change client status command
   * @returns The ID of the client with updated status
   */
  async execute(command: ChangeClientStatusCommand): Promise<string> {
    // Load existing client aggregate from event store
    const client = await this.aggregateRepository.load(command.id, ClientAggregate);

    // Change client status using domain logic
    client.changeStatus(command.newStatus);

    // Persist aggregate (saves events and publishes to event bus)
    await this.aggregateRepository.save(client);

    return command.id;
  }
}
