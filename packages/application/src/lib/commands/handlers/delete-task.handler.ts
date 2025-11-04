import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTaskCommand } from '../delete-task.command';
import { TaskAggregate } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for deleting a task.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler
  extends BaseCommandHandler<DeleteTaskCommand, TaskAggregate>
  implements ICommandHandler<DeleteTaskCommand>
{
  /**
   * Executes the DeleteTaskCommand
   *
   * @param command - The delete task command
   * @returns The ID of the deleted task
   */
  async execute(command: DeleteTaskCommand): Promise<string> {
    return this.executeOnAggregate(command.id, TaskAggregate, (task) => {
      // Delete task using domain logic
      task.delete();
    });
  }
}
