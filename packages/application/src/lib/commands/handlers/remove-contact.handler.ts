import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveContactCommand } from '../remove-contact.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for removing a contact from the system.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(RemoveContactCommand)
export class RemoveContactCommandHandler
  extends BaseCommandHandler<RemoveContactCommand, ClientAggregate>
  implements ICommandHandler<RemoveContactCommand>
{
  /**
   * Executes the RemoveContactCommand
   *
   * @param command - The remove contact command
   * @returns The ID of the client with the removed contact
   */
  async execute(command: RemoveContactCommand): Promise<string> {
    return this.executeOnAggregate(command.clientId, ClientAggregate, (client) => {
      // Remove contact using domain logic
      client.removeContact(command.contactId);
    });
  }
}
