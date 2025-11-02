import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateClientCommand } from '../update-client.command';
import { ClientAggregate, ClientData, Email } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for updating client information.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(UpdateClientCommand)
export class UpdateClientHandler
  extends BaseCommandHandler<UpdateClientCommand, ClientAggregate>
  implements ICommandHandler<UpdateClientCommand>
{
  /**
   * Executes the UpdateClientCommand
   *
   * @param command - The update client command
   * @returns The ID of the updated client
   */
  async execute(command: UpdateClientCommand): Promise<string> {
    return this.executeOnAggregate(command.id, ClientAggregate, (client) => {
      // Convert email string to Email value object for validation
      const email = Email.create(command.data.email);

      // Create ClientData value object with validated email
      const clientData = ClientData.fromPayload({
        ...command.data,
        email
      });

      // Update client information using domain logic
      client.updateInformation(clientData);
    });
  }
}
