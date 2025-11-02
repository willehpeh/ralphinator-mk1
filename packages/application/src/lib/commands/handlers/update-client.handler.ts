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
      // Update client information using domain logic
      client.updateInformation(
        command.data.companyName,
        command.data.email,
        command.data.phone,
        command.data.address,
        command.data.status,
        command.data.notes
      );
    });
  }
}
