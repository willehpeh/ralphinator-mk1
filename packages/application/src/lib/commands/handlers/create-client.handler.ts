import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateClientCommand } from '../create-client.command';
import { ClientAggregate, ClientData, Email } from '@angular-nest-starter/domain';
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
    // Convert email string to Email value object for validation
    const email = Email.create(command.data.email);

    // Create ClientData value object with validated email
    const clientData = ClientData.fromPayload({
      ...command.data,
      email
    });

    // Create new client aggregate using domain logic
    const client = ClientAggregate.create(command.id, clientData);

    // Persist aggregate (saves events and publishes to event bus)
    await this.saveAggregate(client);

    return command.id;
  }
}
