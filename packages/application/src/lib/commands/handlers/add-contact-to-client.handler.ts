import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddContactToClientCommand } from '../add-contact-to-client.command';
import { ClientAggregate } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for adding a contact to a client.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(AddContactToClientCommand)
export class AddContactToClientHandler
  extends BaseCommandHandler<AddContactToClientCommand, ClientAggregate>
  implements ICommandHandler<AddContactToClientCommand>
{
  /**
   * Executes the AddContactToClientCommand
   *
   * @param command - The add contact to client command
   * @returns The ID of the client with the new contact
   */
  async execute(command: AddContactToClientCommand): Promise<string> {
    return this.executeOnAggregate(command.clientId, ClientAggregate, (client) => {
      // Add contact to client using domain logic
      client.addContact(command.contactData);
    });
  }
}
