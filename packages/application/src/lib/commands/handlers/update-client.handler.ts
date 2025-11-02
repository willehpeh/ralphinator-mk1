import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateClientCommand } from '../update-client.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { IAggregateRepository } from '../../ports/aggregate-repository.interface';

/**
 * Command handler for updating client information.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(UpdateClientCommand)
export class UpdateClientHandler implements ICommandHandler<UpdateClientCommand> {
  constructor(
    @Inject('IAggregateRepository') private readonly aggregateRepository: IAggregateRepository<ClientAggregate>
  ) {}

  /**
   * Executes the UpdateClientCommand
   *
   * @param command - The update client command
   * @returns The ID of the updated client
   */
  async execute(command: UpdateClientCommand): Promise<string> {
    // Load existing client aggregate from event store
    const client = await this.aggregateRepository.load(command.id, ClientAggregate);

    // Update client information using domain logic
    client.updateInformation(
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
