import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeProjectStatusCommand } from '../change-project-status.command';
import { ProjectAggregate } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for changing project status.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(ChangeProjectStatusCommand)
export class ChangeProjectStatusHandler
  extends BaseCommandHandler<ChangeProjectStatusCommand, ProjectAggregate>
  implements ICommandHandler<ChangeProjectStatusCommand>
{
  /**
   * Executes the ChangeProjectStatusCommand
   *
   * @param command - The change project status command
   * @returns The ID of the project with updated status
   */
  async execute(command: ChangeProjectStatusCommand): Promise<string> {
    return this.executeOnAggregate(command.id, ProjectAggregate, (project) => {
      // Change project status using domain logic
      project.changeStatus(command.newStatus);
    });
  }
}
