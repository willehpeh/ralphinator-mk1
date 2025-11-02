import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeClientStatusCommand } from '../change-client-status.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for changing client status.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(ChangeClientStatusCommand)
export class ChangeClientStatusHandler
  extends BaseCommandHandler<ChangeClientStatusCommand, ClientAggregate>
  implements ICommandHandler<ChangeClientStatusCommand>
{
  /**
   * Executes the ChangeClientStatusCommand
   *
   * @param command - The change client status command
   * @returns The ID of the client with updated status
   */
  async execute(command: ChangeClientStatusCommand): Promise<string> {
    return this.executeOnAggregate(command.id, ClientAggregate, (client) => {
      // Change client status using domain logic
      client.changeStatus(command.newStatus);
    });
  }
}
