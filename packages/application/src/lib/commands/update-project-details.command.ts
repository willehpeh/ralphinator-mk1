import { ProjectDataPayload } from './project-data.payload';

export class UpdateProjectDetailsCommand {
  constructor(
    public readonly id: string,
    public readonly data: ProjectDataPayload
  ) {}
}
