import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateClientCommand } from '../create-client.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for creating a new client.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(CreateClientCommand)
export class CreateClientHandler
  extends BaseCommandHandler<CreateClientCommand, ClientAggregate>
  implements ICommandHandler<CreateClientCommand>
{
  /**
   * Executes the CreateClientCommand
   *
   * @param command - The create client command
   * @returns The ID of the newly created client
   */
  async execute(command: CreateClientCommand): Promise<string> {
    // Create ClientData value object with validated email using base helper
    const clientData = this.createClientDataFromPayload(command.data);

    // Create new client aggregate using domain logic
    const client = ClientAggregate.create(command.id, clientData);

    // Persist aggregate (saves events and publishes to event bus)
    await this.saveAggregate(client);

    return command.id;
  }
}
