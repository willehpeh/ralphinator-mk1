import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProjectCommand } from '../delete-project.command';
import { ProjectAggregate } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for deleting a project (soft delete).
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler
  extends BaseCommandHandler<DeleteProjectCommand, ProjectAggregate>
  implements ICommandHandler<DeleteProjectCommand>
{
  /**
   * Executes the DeleteProjectCommand
   *
   * @param command - The delete project command
   * @returns The ID of the deleted project
   */
  async execute(command: DeleteProjectCommand): Promise<string> {
    return this.executeOnAggregate(command.id, ProjectAggregate, (project) => {
      // Call domain logic to mark project as deleted
      project.delete();
    });
  }
}
