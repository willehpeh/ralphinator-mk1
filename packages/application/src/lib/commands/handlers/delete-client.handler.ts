import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteClientCommand } from '../delete-client.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { IAggregateRepository } from '../../ports/aggregate-repository.interface';

/**
 * Command handler for deleting a client.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(DeleteClientCommand)
export class DeleteClientHandler implements ICommandHandler<DeleteClientCommand> {
  constructor(
    @Inject('IAggregateRepository') private readonly aggregateRepository: IAggregateRepository<ClientAggregate>
  ) {}

  /**
   * Executes the DeleteClientCommand
   *
   * @param command - The delete client command
   * @returns The ID of the deleted client
   */
  async execute(command: DeleteClientCommand): Promise<string> {
    // Load existing client aggregate from event store
    const client = await this.aggregateRepository.load(command.id, ClientAggregate);

    // Delete client using domain logic
    client.delete();

    // Persist aggregate (saves events and publishes to event bus)
    await this.aggregateRepository.save(client);

    return command.id;
  }
}
