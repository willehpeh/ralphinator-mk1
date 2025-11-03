import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateContactCommand } from '../update-contact.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for updating a contact's information.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(UpdateContactCommand)
export class UpdateContactCommandHandler
  extends BaseCommandHandler<UpdateContactCommand, ClientAggregate>
  implements ICommandHandler<UpdateContactCommand>
{
  /**
   * Executes the UpdateContactCommand
   *
   * @param command - The update contact command
   * @returns The ID of the client with the updated contact
   */
  async execute(command: UpdateContactCommand): Promise<string> {
    return this.executeOnAggregate(command.clientId, ClientAggregate, (client) => {
      // Update contact using domain logic
      client.updateContact(
        command.contactId,
        command.name,
        command.role,
        command.email,
        command.phone
      );
    });
  }
}
