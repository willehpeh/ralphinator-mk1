import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectCommand } from '../create-project.command';
import { ProjectAggregate, ClientAggregate, ProjectData } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';
import { Inject } from '@nestjs/common';
import { IAggregateRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Command handler for creating a new project.
 * Follows CQRS pattern and event sourcing principles.
 * Verifies that the client exists before creating the project.
 */
@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  extends BaseCommandHandler<CreateProjectCommand, ProjectAggregate>
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    @Inject(INJECTION_TOKENS.AGGREGATE_REPOSITORY)
    protected readonly aggregateRepository: IAggregateRepository<ProjectAggregate>
  ) {
    super(aggregateRepository);
  }

  /**
   * Executes the CreateProjectCommand
   *
   * @param command - The create project command
   * @returns The ID of the newly created project
   */
  async execute(command: CreateProjectCommand): Promise<string> {
    // Verify client exists by loading the ClientAggregate
    // This will throw if the client doesn't exist
    await this.aggregateRepository.load(command.data.clientId, ClientAggregate);

    // Create ProjectData value object from payload
    const projectData = ProjectData.fromPayload(command.data);

    // Create new project aggregate using domain logic
    const project = ProjectAggregate.create(command.id, projectData);

    // Persist aggregate (saves events and publishes to event bus)
    await this.saveAggregate(project);

    return command.id;
  }
}
