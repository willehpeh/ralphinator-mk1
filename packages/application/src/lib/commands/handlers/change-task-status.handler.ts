import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeTaskStatusCommand } from '../change-task-status.command';
import { TaskAggregate } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for changing task status.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(ChangeTaskStatusCommand)
export class ChangeTaskStatusHandler
  extends BaseCommandHandler<ChangeTaskStatusCommand, TaskAggregate>
  implements ICommandHandler<ChangeTaskStatusCommand>
{
  /**
   * Executes the ChangeTaskStatusCommand
   *
   * @param command - The change task status command
   * @returns The ID of the updated task
   */
  async execute(command: ChangeTaskStatusCommand): Promise<string> {
    return this.executeOnAggregate(command.taskId, TaskAggregate, (task) => {
      // Change task status using domain logic
      task.changeStatus(command.newStatus);
    });
  }
}
