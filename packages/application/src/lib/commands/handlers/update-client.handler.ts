import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateClientCommand } from '../update-client.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
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
      // Create ClientData value object with validated email using base helper
      const clientData = this.createClientDataFromPayload(command.data);

      // Update client information using domain logic
      client.updateInformation(clientData);
    });
  }
}
