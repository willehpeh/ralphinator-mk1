import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProjectCommand } from '../delete-project.command';
import { ProjectAggregate } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';
import { Inject } from '@nestjs/common';
import { IAggregateRepository, INJECTION_TOKENS } from '../../ports';

/**
 * Command handler for deleting a project (soft delete).
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler
  extends BaseCommandHandler<DeleteProjectCommand, ProjectAggregate>
  implements ICommandHandler<DeleteProjectCommand>
{
  constructor(
    @Inject(INJECTION_TOKENS.AGGREGATE_REPOSITORY)
    protected readonly aggregateRepository: IAggregateRepository<ProjectAggregate>
  ) {
    super(aggregateRepository);
  }

  /**
   * Executes the DeleteProjectCommand
   *
   * @param command - The delete project command
   * @returns The ID of the deleted project
   */
  async execute(command: DeleteProjectCommand): Promise<string> {
    // Load the project aggregate from the event store
    const project = await this.aggregateRepository.load(
      command.id,
      ProjectAggregate
    );

    // Call domain logic to mark project as deleted
    project.delete();

    // Persist aggregate (saves events and publishes to event bus)
    await this.saveAggregate(project);

    return command.id;
  }
}
