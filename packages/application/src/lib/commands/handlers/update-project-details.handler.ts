import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProjectDetailsCommand } from '../update-project-details.command';
import { ProjectAggregate, ProjectData } from '@angular-nest-starter/domain';
import { BaseCommandHandler } from '../base';

/**
 * Command handler for updating project details.
 * Follows CQRS pattern and event sourcing principles.
 */
@CommandHandler(UpdateProjectDetailsCommand)
export class UpdateProjectDetailsHandler
  extends BaseCommandHandler<UpdateProjectDetailsCommand, ProjectAggregate>
  implements ICommandHandler<UpdateProjectDetailsCommand>
{
  /**
   * Executes the UpdateProjectDetailsCommand
   *
   * @param command - The update project details command
   * @returns The ID of the updated project
   */
  async execute(command: UpdateProjectDetailsCommand): Promise<string> {
    return this.executeOnAggregate(command.id, ProjectAggregate, (project) => {
      // Create ProjectData value object from payload
      const projectData = ProjectData.fromPayload(command.data);

      // Update project details using domain logic
      project.updateDetails(projectData);
    });
  }
}
