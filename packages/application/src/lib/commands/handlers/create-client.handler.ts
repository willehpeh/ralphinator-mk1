import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateClientCommand } from '../create-client.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { IAggregateRepository } from '../../ports/aggregate-repository.interface';

/**
 * Command handler for creating a new client.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(CreateClientCommand)
export class CreateClientHandler implements ICommandHandler<CreateClientCommand> {
  constructor(
    @Inject('IAggregateRepository') private readonly aggregateRepository: IAggregateRepository<ClientAggregate>
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
      command.data.companyName,
      command.data.email,
      command.data.phone,
      command.data.address,
      command.data.status,
      command.data.notes
    );

    // Persist aggregate (saves events and publishes to event bus)
    await this.aggregateRepository.save(client);

    return command.id;
  }
}
