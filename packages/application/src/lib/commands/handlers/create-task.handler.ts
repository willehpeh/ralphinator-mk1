import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../create-task.command';
import { TaskAggregate, TaskData } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for creating a new task.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler
  extends BaseCommandHandler<CreateTaskCommand, TaskAggregate>
  implements ICommandHandler<CreateTaskCommand>
{
  /**
   * Executes the CreateTaskCommand
   *
   * @param command - The create task command
   * @returns The ID of the newly created task
   */
  async execute(command: CreateTaskCommand): Promise<string> {
    // Create TaskData value object from payload
    const taskData = TaskData.fromPayload(command.data);

    // Create new task aggregate using domain logic
    const task = TaskAggregate.create(command.id, taskData);

    // Persist aggregate (saves events and publishes to event bus)
    await this.saveAggregate(task);

    return command.id;
  }
}
