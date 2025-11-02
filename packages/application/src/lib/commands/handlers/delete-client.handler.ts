import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteClientCommand } from '../delete-client.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for deleting a client.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(DeleteClientCommand)
export class DeleteClientHandler
  extends BaseCommandHandler<DeleteClientCommand, ClientAggregate>
  implements ICommandHandler<DeleteClientCommand>
{
  /**
   * Executes the DeleteClientCommand
   *
   * @param command - The delete client command
   * @returns The ID of the deleted client
   */
  async execute(command: DeleteClientCommand): Promise<string> {
    return this.executeOnAggregate(command.id, ClientAggregate, (client) => {
      // Delete client using domain logic
      client.delete();
    });
  }
}
