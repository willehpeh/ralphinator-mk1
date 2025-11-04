import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTaskDetailsCommand } from '../update-task-details.command';
import { TaskAggregate, TaskData } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for updating task details.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(UpdateTaskDetailsCommand)
export class UpdateTaskDetailsHandler
  extends BaseCommandHandler<UpdateTaskDetailsCommand, TaskAggregate>
  implements ICommandHandler<UpdateTaskDetailsCommand>
{
  /**
   * Executes the UpdateTaskDetailsCommand
   *
   * @param command - The update task details command
   * @returns The ID of the updated task
   */
  async execute(command: UpdateTaskDetailsCommand): Promise<string> {
    return this.executeOnAggregate(command.id, TaskAggregate, (task) => {
      // Create TaskData value object from payload
      const taskData = TaskData.fromPayload(command.data);

      // Update task details using domain logic
      task.updateDetails(taskData);
    });
  }
}
