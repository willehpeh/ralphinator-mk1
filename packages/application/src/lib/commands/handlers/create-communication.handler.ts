import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommunicationCommand } from '../create-communication.command';
import { CommunicationAggregate, ClientAggregate, ProjectAggregate, CommunicationData } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';
import { Inject } from '@nestjs/common';
import { IAggregateRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Command handler for creating a new communication record.
 * Follows CQRS pattern and event sourcing principles.
 * Validates that the client exists and optionally verifies that
 * contact belongs to client and project belongs to client.
 */
@CommandHandler(CreateCommunicationCommand)
export class CreateCommunicationHandler
  extends BaseCommandHandler<CreateCommunicationCommand, CommunicationAggregate>
  implements ICommandHandler<CreateCommunicationCommand>
{
  constructor(
    @Inject(INJECTION_TOKENS.AGGREGATE_REPOSITORY)
    protected readonly aggregateRepository: IAggregateRepository<CommunicationAggregate>
  ) {
    super(aggregateRepository);
  }

  /**
   * Executes the CreateCommunicationCommand
   *
   * @param command - The create communication command
   * @returns The ID of the newly created communication
   * @throws {Error} If client doesn't exist
   * @throws {Error} If contact is specified but doesn't belong to the client
   * @throws {Error} If project is specified but doesn't belong to the client
   */
  async execute(command: CreateCommunicationCommand): Promise<string> {
    // Verify client exists by loading the ClientAggregate
    // This will throw if the client doesn't exist
    const client = await this.aggregateRepository.load(command.data.clientId, ClientAggregate);

    // If contact is specified, verify it belongs to the client
    if (command.data.contactId) {
      const contacts = client.getContacts();
      const contactExists = contacts.some(contact => contact.contactId === command.data.contactId);

      if (!contactExists) {
        throw new Error('Contact does not belong to the specified client');
      }
    }

    // If project is specified, verify it belongs to the client
    if (command.data.projectId) {
      const project = await this.aggregateRepository.load(command.data.projectId, ProjectAggregate);

      if (project.getClientId() !== command.data.clientId) {
        throw new Error('Project does not belong to the specified client');
      }
    }

    // Create CommunicationData value object from payload
    const communicationData = CommunicationData.fromPayload(command.data);

    // Create new communication aggregate using domain logic
    const communication = CommunicationAggregate.create(command.id, communicationData);

    // Persist aggregate (saves events and publishes to event bus)
    await this.saveAggregate(communication);

    return command.id;
  }
}
